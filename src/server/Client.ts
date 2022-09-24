import { generateV4, UUID } from '@minecraft-js/uuid';
import { HasJoinedResponse, yggdrasil } from '@minecraft-js/yggdrasil';
import * as NodeRSA from 'node-rsa';
import { constants, privateDecrypt, randomBytes } from 'node:crypto';
import * as EventEmitter from 'node:events';
import { Socket } from 'node:net';
import TypedEmitter from 'typed-emitter';
import {
  ClientboundPacketWriter,
  PacketReader,
  packets,
  PacketWriter,
  ServerboundPacketReader,
  State,
} from '../protocol';
import { HandshakePacket } from '../protocol/handshaking/server';
import { ResponsePacket } from '../protocol/status/client';
import { PingPacket, RequestPacket } from '../protocol/status/server';

/**
 * Represent a client connected to a server
 */
export class MinecraftServerClient extends (EventEmitter as new () => TypedEmitter<MinecraftServerClientEvents>) {
  /** UUID of the client */
  public UUID: UUID;
  /** Username of the client */
  public username: string;
  /** Whether or not this client is playing */
  public playing: boolean;
  /** Shared secret used for encryption, only defined if online mode is enabled */
  private sharedSecret: Buffer;

  /** PacketReader instance usedr to read the packets from the client */
  public readonly packetReader: ServerboundPacketReader;
  /** PacketWriter instance used to write the packets to the client */
  public readonly packetWriter: ClientboundPacketWriter;

  /** Socket bound to this client */
  private readonly socket: Socket;
  /** Options passed to this ServerClient */
  private readonly options: MinecraftServerClientOptions;

  /**
   * Create a new Minecraft Server Client (a client that is create by a server)
   * @param socket TCP Socket this client comes from
   * @param options Options to pass to this MinecraftServerClient instance
   */
  public constructor(socket: Socket, options?: MinecraftServerClientOptions) {
    super();

    this.playing = false;

    this.options = options ?? {};
    this.socket = socket;
    this.packetReader = new PacketReader(packets.serverbound, {
      // debugging: true,
      // debugTag: 'ServerClient',
    });
    this.packetWriter = new PacketWriter(packets.clientbound);

    this.socket.on('data', (data) => {
      this.emit('raw_data', data);
      this.packetReader.readTCPMessage(data);
    });

    this.socket.on('close', () => {
      if (!this.playing) return;
      this.emit('disconnected');
    });

    this.packetReader.oncePacket('HandshakePacket', (...args) =>
      this.onHandshake(...args)
    );
  }

  /**
   * Write raw bytes to the client
   * @param buffer Buffer to get the data from
   */
  public writeRaw(buffer: Buffer): void {
    this.socket.write(buffer);
  }

  /**
   * Authenticate the player
   * @returns Information about the player (name, UUID, skin, etc)
   */
  private authenticate(): Promise<HasJoinedResponse> {
    return new Promise((resolve) => {
      if (!this.options.serverKey) throw new Error('Missing server key');

      const verifyToken = randomBytes(4);

      const publicKeyArray = this.options.serverKey
        .exportKey('pkcs8-public-pem')
        .split('\n');
      publicKeyArray.pop();
      publicKeyArray.shift();
      const publicKey = Buffer.from(publicKeyArray.join(''), 'base64');

      const encryptionRequest = this.packetWriter.write(
        'EncryptionRequestPacket',
        {
          serverId: '', // After 1.7.x this field is always an empty string
          publicKey: publicKey,
          verifyToken: verifyToken,
        }
      );

      this.writeRaw(encryptionRequest);

      const decryptKey = {
        key: this.options.serverKey.exportKey(),
        padding: constants.RSA_PKCS1_PADDING,
      };

      this.packetReader.oncePacket(
        'EncryptionResponsePacket',
        async (packet) => {
          const decryptedVerifyToken = await privateDecrypt(
            decryptKey,
            packet.data.verifyToken
          );
          if (verifyToken.compare(decryptedVerifyToken) !== 0)
            throw new Error('Invalid verify token');

          this.sharedSecret = privateDecrypt(
            decryptKey,
            packet.data.sharedSecret
          );

          const hasJoined = await yggdrasil.hasJoined(
            this.username,
            '',
            this.sharedSecret,
            publicKey
          );

          this.packetWriter.setEncryption(true, this.sharedSecret);
          resolve(hasJoined);
        }
      );
    });
  }

  /**
   * Execute the handshake sequence whether the client wants
   * to play or just ping the server.
   * @param handshake Handshake packet received from the client
   */
  private onHandshake(handshake: HandshakePacket): void {
    // For players connecting to the server
    this.packetReader.oncePacket('LoginStartPacket', async (loginStart) => {
      // Only apply for offline players.
      // If online mode is enabled those fields
      // are going to be overwritten
      this.username = loginStart.data.name;
      this.UUID = generateV4();

      if (this.options.onlineMode === true) {
        const infos = await this.authenticate();
        this.username = infos.name;
        this.UUID = infos.id;
      }

      const compressionTreshold = this.options.compressionTreshold;
      if (compressionTreshold && compressionTreshold >= 0) {
        const setCompression = this.packetWriter.write('SetCompressionPacket', {
          threshold: compressionTreshold,
        });

        this.writeRaw(setCompression);

        this.packetReader.setCompression(true, compressionTreshold);
        this.packetWriter.setCompression(true, compressionTreshold);
      }

      const loginSuccess = this.packetWriter.write('LoginSuccessPacket', {
        username: this.username,
        UUID: this.UUID,
      });
      this.packetReader.state = State.PLAY;

      this.writeRaw(loginSuccess);

      this.playing = true;
      this.emit('playing');
    });

    // For players pinging the server
    const statusListeners = {
      PingPacket: async (packet: PingPacket) => {
        let payload = packet.data.payload;
        if (this.options.onBeforePong)
          payload = await this.options.onBeforePong(packet);

        const pong = this.packetWriter.write('PongPacket', { payload });
        this.writeRaw(pong);

        // Ping is sent after RequestPacket by the Notchian client
        // so we only destroy the socket when receiving the ping
        this.socket.destroy();
      },
      RequestPacket: async (packet: RequestPacket) => {
        this.emit('status');

        /** Default hardcoded response */
        let payload: ResponsePacket['data'] = {
          description: {
            text: 'A Minecraft server\nPowered by MinecraftJS',
          },
          players: {
            max: 20,
            online: 0,
            sample: [],
          },
          version: {
            name: '1.8.9',
            protocol: 47,
          },
        };

        if (this.options.onBeforeResponse)
          payload = await this.options.onBeforeResponse(packet, payload);

        const response = this.packetWriter.write('ResponsePacket', payload);
        this.writeRaw(response);
      },
    };

    for (const packet in statusListeners) {
      this.packetReader.oncePacket(
        packet as keyof typeof statusListeners,
        statusListeners[packet]
      );
    }
  }
}

export type MinecraftServerClientEvents = {
  status: () => void;
  playing: () => void;
  disconnected: () => void;
  raw_data: (data: Buffer) => void;
};

export interface MinecraftServerClientOptions {
  /** Compression treshold to apply (if not specified or `-1` compression isn't enabled) */
  compressionTreshold?: number;
  /** Whether or not online mode is enabled on the server */
  onlineMode?: boolean;
  /** Server's RSA key */
  serverKey?: NodeRSA;
  /**
   * This function is called when the PingPacket is received.
   * If a function is provided it'll take its return value
   * and send it as the response to the PingPacket.
   * @param packet The received packet from the client
   * @returns The data you want to send back to the client
   */
  onBeforePong?(packet: PingPacket): number | Promise<number>;
  /**
   * This function is called when the RequestPacket is received.
   * If a function is provided it'll take its return value
   * and send it as the response to the RequestPacket.
   * @param packet The received packet from the client
   * @param payload The default payload
   * @returns The data you want to send back to the client
   */
  onBeforeResponse?(
    packet: RequestPacket,
    payload: ResponsePacket['data']
  ): ResponsePacket['data'] | Promise<ResponsePacket['data']>;
}
