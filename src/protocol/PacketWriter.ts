import { BufWrapper } from '@minecraft-js/bufwrapper';
import { Cipher, createCipheriv } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { ProtocolResolvable } from '..';
import { Packet } from './Packet';

export class PacketWriter<Protocol extends ProtocolResolvable> {
  /** Whether or not the encryption is enabled */
  public encryptionEnabled: boolean;
  /** Shared secret between the server and the client */
  public encryptionSharedSecret: Buffer;
  /** Whether or not compression is enabled */
  public compressionEnabled: boolean;
  /** Compression treshold */
  public compressionTreshold: number;

  public cipher: Cipher;
  /** Protocol this `PacketWriter` is bound to */
  public protocol: Protocol;

  /**
   * Instanciate a new `PacketWriter`. Use this class to write packets
   * @param protocol Protocol to bind this `PacketWriter` to
   * @example
   * ```javascript
   * const packetWriter = new PacketWriter(packets.serverbound);
   * ```
   */
  public constructor(protocol: Protocol) {
    this.encryptionEnabled = false;
    this.encryptionSharedSecret = Buffer.alloc(0);

    this.compressionEnabled = false;
    this.compressionTreshold = -1;

    this.protocol = protocol;
  }

  /**
   * Write a packet
   * @example
   * ```javascript
   * packetWriter.write('HandshakePacket', {
   *   protocolVersion: 47,
   *   serverAddress: 'localhost',
   *   serverPort: 25565,
   *   nextState: 2,
   * });
   * ```
   * @param packet Name of the packet to build
   * @param data Data of the packet
   * @returns The buffer containing the written packet
   */
  public write<T extends keyof Protocol>(
    packetName: T,
    data: InstanceType<Protocol[T]>['data']
  ): Buffer {
    let Packet = this.protocol[packetName];

    if (!Packet)
      throw new Error(
        `Can't write unknown packet (packet=${packetName.toString()})`
      );

    const packetBuf = new BufWrapper(null, { oneConcat: true });
    packetBuf.writeVarInt(Packet.id);

    const packet = new Packet(packetBuf);
    packet.write(data);

    /** Length of uncompressed (Packet ID + Data) */
    const dataLength = packetBuf.buffer.length;

    /**
     * Buffer containing:
     * - If compression active:   Data Length + Packet ID (compressed) + Data (compressed)
     * - If compression inactive: Packet ID + Data
     */
    let compressionBuf = new BufWrapper(null, { oneConcat: true });
    if (this.compressionEnabled && dataLength >= this.compressionTreshold) {
      // Length of uncompressed (Packet ID + Data)
      compressionBuf.writeVarInt(dataLength);

      const compressed = deflateSync(packet.buf.buffer);
      compressionBuf.writeBytes(compressed);

      compressionBuf.finish();
    } else {
      compressionBuf = packetBuf;
    }

    const final = new BufWrapper(null, { oneConcat: true });
    final.writeVarInt(compressionBuf.buffer.length);
    final.writeBytes(compressionBuf.buffer);
    final.finish();

    if (this.encryptionEnabled) return this.cipher.update(final.buffer);

    return final.buffer;
  }

  /**
   * Sometimes you don't have the name of the class
   * at runtime. Use this method to write a packet
   * from a Class.
   * @example
   * ```javascript
   * // Get somehow the `HandshakePacket` class
   * packetWriter.writeFromClass(HandshakePacket, {
   *   protocolVersion: 47,
   *   serverAddress: 'localhost',
   *   serverPort: 25565,
   *   nextState: 2,
   * });
   * ```
   * @param constructor Class of the packet to write
   * @param data Data to pass into the packet
   * @returns The buffer containing the written packet
   */
  public writeFromClass<T extends typeof Packet>(
    constructor: T,
    data: InstanceType<T>['data']
  ): Buffer {
    return this.write(constructor.name, data);
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

    this.cipher = createCipheriv(
      'aes-128-cfb8',
      this.encryptionSharedSecret,
      this.encryptionSharedSecret
    );
  }

  /**
   * Set the compression specifications, whether to enable it or not and its treshold
   * @param enabled Whether or not the compression is enabled
   * @param treshold If yes, you must provide the compression threshold
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
}
