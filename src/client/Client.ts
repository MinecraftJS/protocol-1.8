import { UUID } from '@minecraft-js/uuid';
import { yggdrasil } from '@minecraft-js/yggdrasil';
import { constants, publicEncrypt, randomBytes } from 'node:crypto';
import * as EventEmitter from 'node:events';
import { Socket } from 'node:net';
import TypedEmitter from 'typed-emitter';
import {
  ClientboundPacketReader,
  ClientboundProtocol,
  PacketReader,
  packets,
  PacketWriter,
  ServerboundPacketWriter,
  State,
} from '../protocol';
import { parsePublicKey } from '../utils';

export class MinecraftClient extends (EventEmitter as new () => TypedEmitter<MinecraftClientEvents>) {
  /** UUID of the client */
  public UUID: UUID;
  /** Username of the client */
  public username: string;

  /** PacketReader instance used to read the packets from the server */
  public readonly packetReader: ClientboundPacketReader;
  /** PacketWriter instance used to write the packets to the server */
  public readonly packetWriter: ServerboundPacketWriter;

  /** Socket bound to this client */
  private readonly socket: Socket;
  /** Options passed to this Client */
  private readonly options: MinecraftClientOptions;

  /**
   * Create a new Minecraft client
   * @param options Options to pass to the client
   */
  public constructor(options?: MinecraftClientOptions) {
    super();

    this.options = options ?? {
      username: `Player`,
      serverAddress: '127.0.0.1',
    };

    this.socket = new Socket();
    this.packetReader = new PacketReader(packets.clientbound, {
      debugging: false,
      debugTag: 'Client',
    });
    this.packetWriter = new PacketWriter(packets.serverbound);

    this.socket.on('data', (data) => {
      this.emit('raw_data', data);
      this.packetReader.readTCPMessage(data);
    });

    this.socket.connect(
      this.options.serverPort ?? 25565,
      this.options.serverAddress,
      () => {
        this.doLoginSequence();
      }
    );

    this.packetReader.onPacket('KeepAlivePacket', (packet) => {
      if (this.options.disableBuiltInKeepAlive === true) return;

      const keepAlive = this.packetWriter.write('KeepAlivePacket', {
        id: packet.data.id,
      });

      this.writeRaw(keepAlive);
    });

    this.packetReader.on('anyPacket', (name, packet) => {
      this.emit('packet', name, packet);
    });

    this.packetReader.on('unknownPacket', (buffer) => {
      this.emit('unknownPacket', buffer);
    });
  }

  /**
   * Write raw bytes to the client
   * @param buffer Buffer to get the data from
   */
  public writeRaw(buffer: Buffer): void {
    this.socket.write(buffer);
  }

  /**
   * Execute the login sequence
   * - C -> S: Handshake with Next State set to 2 (login)
   * - C -> S: Login Start
   *
   * `---- Online mode begin ----`
   * - S -> C: Encryption Request
   * - *Client auth*
   * - C -> S: Encryption Response
   * - *Server auth, both enable encryption*
   *
   * `---- Online mode end ----`
   * - S -> C: Login Success and Set Compression
   * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Login
   */
  private doLoginSequence(): void {
    const handshake = this.packetWriter.write('HandshakePacket', {
      protocolVersion: 47,
      serverAddress: this.options.serverAddress,
      serverPort: this.options.serverPort ?? 25565,
      nextState: State.LOGIN,
    });
    this.packetReader.state = State.LOGIN;

    this.writeRaw(handshake);

    const loginStart = this.packetWriter.write('LoginStartPacket', {
      name: this.options.username,
    });

    this.writeRaw(loginStart);

    // Encryption support
    this.packetReader.onPacket('EncryptionRequestPacket', async (packet) => {
      const sharedToken = randomBytes(16);
      const serverPublicKey = parsePublicKey(packet.data.publicKey);

      const key = {
        key: serverPublicKey,
        padding: constants.RSA_PKCS1_PADDING,
      };

      const encryptedVerifyToken = publicEncrypt(key, packet.data.verifyToken);
      const encryptedSharedToken = publicEncrypt(key, sharedToken);

      await yggdrasil.join(
        this.options.accessToken,
        this.options.UUID,
        packet.data.serverId,
        sharedToken,
        packet.data.publicKey
      );

      const encryptionResponse = this.packetWriter.write(
        'EncryptionResponsePacket',
        {
          verifyToken: encryptedVerifyToken,
          sharedSecret: encryptedSharedToken,
        }
      );

      this.writeRaw(encryptionResponse);

      this.packetReader.setEncryption(true, sharedToken);
      this.packetWriter.setEncryption(true, sharedToken);
    });

    this.packetReader.onPacket('SetCompressionPacket', (packet) => {
      console.log('Compression treshold set to', packet.data.threshold);

      this.packetWriter.setCompression(true, packet.data.threshold);
    });

    this.packetReader.onPacket('LoginSuccessPacket', (packet) => {
      this.packetReader.state = State.PLAY;

      this.UUID = packet.data.UUID;
      this.username = packet.data.username;

      this.emit('connected');
    });
  }
}

export type MinecraftClientEvents = {
  connected: () => void;
  raw_data: (data: Buffer) => void;
  packet: <T extends keyof ClientboundProtocol>(
    name: T,
    packet: InstanceType<ClientboundProtocol[T]>
  ) => void;
  unknownPacket: (buffer: Buffer) => void;
};

/** Options you can pass to a `MinecraftClient` */
export interface MinecraftClientOptions {
  /** Username for this client */
  username: string;
  /** The address of the server you want to connect to */
  serverAddress: string;
  /** Port of the server, defaults to `25565` */
  serverPort?: number;
  /** Whether or not to disable the built-in keepalive */
  disableBuiltInKeepAlive?: boolean;
  /** Access token of the account */
  accessToken?: string;
  /** UUID of the account */
  UUID?: UUID;
}
