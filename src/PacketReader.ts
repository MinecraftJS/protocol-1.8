import { BufWrapper } from '@minecraft-js/bufwrapper';
import {
  constants,
  createDecipheriv,
  Decipher,
  KeyObject,
  privateDecrypt,
} from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { ProtocolResolvable } from './protocol';
import { State } from './protocol/constants';
import { HandshakePacket } from './protocol/handshaking/server';
import {
  EncryptionRequestPacket,
  LoginSuccessPacket,
  SetCompressionPacket,
} from './protocol/login/client';
import { EncryptionResponsePacket } from './protocol/login/server';
import { Packet } from './protocol/Packet';

export class PacketReader<Protocol extends ProtocolResolvable> {
  /** Whether or not the encryption is enabled */
  public encryptionEnabled: boolean;
  /** Private key used to decrypt the shared secret */
  public encryptionKey: KeyObject;
  /** Shared secret between the server and the client */
  public encryptionSharedSecret: Buffer;
  /** Whether or not compression is enabled */
  public compressionEnabled: boolean;
  /** Compression treshold */
  public compressionTreshold: number;
  /** State this PacketHandler is currently in */
  public state: State;

  /** Protocol object containing all the packets */
  private protocol: Protocol;
  /** Object containing all the packet listeners */
  private packetListeners: { [key: string]: ((...args: any[]) => any)[] };
  /** Options applied to this instance */
  private options: PacketReaderOptions;
  /** Decipher instance, used to decrypt packets */
  private decipher: Decipher;
  /**
   * Array containing packets in
   * the queue, waiting for the rest
   * of the packet (fragmentation)
   */
  private queue: Buffer[];

  public constructor(protocol: Protocol, options?: PacketReaderOptions) {
    this.encryptionEnabled = false;
    this.encryptionKey = null;
    this.encryptionSharedSecret = Buffer.alloc(0);

    this.compressionEnabled = false;
    this.compressionTreshold = -1;

    this.state = State.HANDSHAKING; // Default state

    this.protocol = protocol;
    this.packetListeners = {};
    this.options = options || {};
    this.decipher = null;
    this.queue = [];
  }

  /**
   * Read a raw TCP message. If the buffer
   * contains an incomplete packet (due to
   * fragmentation) this method will wait
   * until you give it more data (by calling
   * again the method with the next TCP message).
   *
   * This method also handles encryption.
   *
   * If your buffer contains a full packet
   * compressed or uncompressed use the
   * `read` method.
   * @param buffer TCP message
   */
  public readTCPMessage(buffer: Buffer): void {
    // Encryption
    if (this.encryptionEnabled) buffer = this.decipher.update(buffer);

    // Fragmentation
    this.queue.push(buffer);

    const allBuffers = Buffer.concat(this.queue);
    const buf = new BufWrapper(allBuffers);
    const packetLength = buf.readVarInt() + buf.offset;

    if (packetLength <= allBuffers.length) {
      this.queue = [allBuffers.subarray(packetLength)];
      buffer = allBuffers.subarray(0, packetLength);
    } else {
      this.debug('Received part', this.queue.length);
      return;
    }

    this.read(buffer);

    // Read packet if there's more than one full packet in the buffer
    if (this.queue[0].length > 0) this.readTCPMessage(Buffer.alloc(0));
  }

  /**
   * Read the given packet, the packet can
   * be compressed or uncompressed this
   * method will be able to read it.
   *
   * If your buffer contains multiple packets
   * or is encrypted use the `readTCPMessage`
   * method instead.
   * @param buffer Raw packet
   */
  public read(buffer: Buffer): void {
    const buf = new BufWrapper(buffer);
    const packetLength = buf.readVarInt();

    let rawPacket = buf.readBytes(packetLength);
    let rawPacketBuf = new BufWrapper(rawPacket);

    if (this.compressionEnabled) {
      const dataLength = rawPacketBuf.readVarInt();
      const dataLengthLength = rawPacketBuf.offset;

      let shouldReadAsUncompressed =
        dataLength === 0 || dataLength < this.compressionTreshold;

      if (!shouldReadAsUncompressed) {
        const toDecompress = rawPacketBuf.readBytes(
          packetLength - dataLengthLength
        );

        rawPacketBuf = new BufWrapper(inflateSync(toDecompress));

        if (rawPacketBuf.buffer.length !== dataLength)
          process.emitWarning(
            'Data Length and decompressed packet length mismatch'
          );
      }
    }

    let packetIdLength = rawPacketBuf.offset;
    const packetId = rawPacketBuf.readVarInt();
    packetIdLength = rawPacketBuf.offset - packetIdLength;

    const data = rawPacketBuf.readBytes(packetLength - packetIdLength);

    const Packet = Object.values(this.protocol).find(
      (P) => P.id === packetId && P.state === this.state
    );
    const event = Object.keys(this.protocol).find(
      (key) => this.protocol[key] === Packet
    );

    if (Packet && event) {
      this.debug(event);

      const packet = new Packet(new BufWrapper(data));
      packet.read();

      if (this.options.disablePacketEffectProcessing !== true)
        this.processPacketEffect(packet);

      // @ts-ignore
      this.emitPacket(event, packet);
    } else {
      this.debug(
        `PacketID=${packetId} State=${this.state} Length=${buffer.length}`
      );
    }
  }

  /**
   * Set the encryption specifications, whether to enable it or not and its key
   * @param enabled Whether or not the encryption is enabled
   * @param sharedSecret If enabled, you must provide the shared secret
   */
  public setEncryption(enabled: boolean, sharedSecret?: Buffer): void {
    this.encryptionEnabled = enabled;

    if (
      !enabled &&
      (!(this.encryptionSharedSecret instanceof Buffer) ||
        !(sharedSecret instanceof Buffer))
    )
      throw new TypeError(
        `Must provide a valid sharedSecret when enabling encryption, received a sharedSecret of type ${typeof sharedSecret}`
      );

    this.encryptionSharedSecret = sharedSecret;

    this.decipher = createDecipheriv(
      'aes-128-cfb8',
      this.encryptionSharedSecret,
      this.encryptionSharedSecret
    );
  }

  /**
   * Set the compression specifications, whether to enable it or not and its treshold
   * @param enabled Whether or not the compression is enabled
   * @param treshold If yes, you can provide the compression threshold
   */
  public setCompression(enabled: boolean, treshold?: number): void {
    this.compressionEnabled = enabled;

    if (
      enabled &&
      (typeof this.compressionTreshold !== 'number' ||
        typeof treshold !== 'number')
    )
      throw new TypeError(
        `Must provide a valid treshold when enabling compression, received a treshold of type ${typeof treshold}`
      );
    this.compressionTreshold = treshold;
  }

  /**
   * Add an event listener, will be triggered when the packet specified is received
   * @param name Name of the packet to listen to
   * @param listener Listener function called when the event is triggered
   */
  public onPacket<T extends keyof PacketReaderEvents<Protocol>>(
    name: T,
    listener: PacketReaderEvents<Protocol>[T]
  ): void {
    if (!Array.isArray(this.packetListeners[name as string]))
      return void (this.packetListeners[name as string] = [listener]);
    this.packetListeners[name as string].push(listener);
  }

  /**
   * Remove an event listener
   * @param name Name of the packet to remove
   * @param listener Listener function to remove
   * @returns A boolean, true if removed, false otherwise
   */
  public offPacket<T extends keyof PacketReaderEvents<Protocol>>(
    name: T,
    listener: PacketReaderEvents<Protocol>[T]
  ): boolean {
    if (!Array.isArray(this.packetListeners[name as string])) return false;
    return (
      this.packetListeners[name as string].filter((v) => v !== listener)
        .length > 0
    );
  }

  /**
   * Emit a packet event
   * @param name Name of the packet you want to emit an event for
   * @param args Args to pass to the listeners
   */
  public emitPacket<T extends keyof PacketReaderEvents<Protocol>>(
    name: T,
    ...args: Parameters<PacketReaderEvents<Protocol>[T]>
  ): void {
    const listeners = this.packetListeners[name as string];
    if (!Array.isArray(listeners)) return;
    listeners.forEach((listener) => listener(...args));
  }

  /**
   * Processes some packets (packets that have an effect
   * on the PacketReader such as sate changement).
   */
  private processPacketEffect(packet: Packet<unknown>): void {
    // Client to Server
    if (packet instanceof HandshakePacket)
      return void (this.state = packet.data.nextState);

    if (packet instanceof LoginSuccessPacket)
      return void (this.state = State.PLAY);

    if (packet instanceof EncryptionResponsePacket) {
      const key = {
        key: this.encryptionKey,
        padding: constants.RSA_PKCS1_PADDING,
      };

      // const verifyToken = privateDecrypt(
      //   {
      //     key: this.encryptionKey,
      //     padding: constants.RSA_PKCS1_PADDING,
      //   },
      //   packet.data.sharedSecret
      // );

      const sharedToken = privateDecrypt(key, packet.data.sharedSecret);
      this.setEncryption(true, sharedToken);
    }

    // Server to Client
    if (packet instanceof EncryptionRequestPacket) {
      // Handle encryption request
    }

    if (packet instanceof SetCompressionPacket)
      return this.setCompression(
        packet.data.threshold !== -1,
        packet.data.threshold
      );
  }

  private debug(...args: any[]): void {
    if (this.options.debugging !== true) return;
    const tag = this.options.debugTag ? ` [${this.options.debugTag}]` : '';
    console.debug('PacketReader' + tag, ...args);
  }
}

type PacketReaderEvents<Protocol extends ProtocolResolvable> = {
  [key in keyof Protocol]: (packet: InstanceType<Protocol[key]>) => void;
};

export interface PacketReaderOptions {
  /**
   * Some packets have a direct effect on the packet reader,
   * such as packets that sets the compression treshold, encryption
   * details and the state. Those special packets are handled by
   * default and their effect is applied on this packet reader.
   * However if you want to disable this automatic process
   * to use yours instead make this `true`.
   */
  disablePacketEffectProcessing?: boolean;
  /** Whether or not to output debug logs */
  debugging?: boolean;
  /**
   * In case you have multiple PacketReader
   * and `debugging` enabled set a `debugTag`
   * to, when logged, know which PacketReader
   * the log comes from
   */
  debugTag?: string;
}
