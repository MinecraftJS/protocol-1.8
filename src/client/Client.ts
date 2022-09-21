import { UUID } from '@minecraft-js/uuid';
import * as EventEmitter from 'node:events';
import { Socket } from 'node:net';
import TypedEmitter from 'typed-emitter';
import {
  ClientboundPacketReader,
  PacketReader,
  packets,
  PacketWriter,
  ServerboundPacketWriter,
  State,
} from '../protocol';

export class MinecraftClient extends (EventEmitter as new () => TypedEmitter<MinecraftClientEvents>) {
  /** UUID of the client */
  public UUID: UUID;
  /** Username of the client */
  public username: string;

  /** Socket bound to this client */
  private readonly socket: Socket;
  /** PacketReader instance usedr to read the packets from the server */
  private readonly packetReader: ClientboundPacketReader;
  /** PacketWriter instance used to write the packets to the server */
  private readonly packetWriter: ServerboundPacketWriter;
  /** Options passed to this Client */
  private readonly options: MinecraftClientOptions;

  public constructor(options?: MinecraftClientOptions) {
    super();

    this.options = options ?? {
      username: `Player`,
      serverAddress: '127.0.0.1',
    };

    this.socket = new Socket();
    this.packetReader = new PacketReader(packets.clientbound, {
      // debugging: true,
      // debugTag: 'Client',
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
  }

  /**
   * Write raw bytes to the client
   * @param buffer Buffer to get the data from
   */
  public writeRaw(buffer: Buffer): void {
    this.socket.write(buffer);
  }

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

    this.packetReader.onPacket('SetCompressionPacket', (packet) => {
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
};

export interface MinecraftClientOptions {
  /** Username for this client */
  username: string;
  /** The address of the server you want to connect to */
  serverAddress: string;
  /** Port of the server, defaults to `25565` */
  serverPort?: number;
}
