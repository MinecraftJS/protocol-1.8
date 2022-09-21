import * as EventEmitter from 'node:events';
import { Server } from 'node:net';
import TypedEmitter from 'typed-emitter';
import { ResponsePacket } from '../protocol/status/client';
import { PingPacket, RequestPacket } from '../protocol/status/server';
import { MinecraftServerClient } from './Client';

/**
 * Represent a Minecraft server
 */
export class MinecraftServer extends (EventEmitter as new () => TypedEmitter<MinecraftServerEvents>) {
  /** Array with all the connected players */
  public readonly players: MinecraftServerClient[];

  /** The actual TCP server */
  private readonly server: Server;
  /** Options passed into this MinecraftServer */
  private readonly options: MinecraftServerOptions;

  /**
   * Create a new Minecraft server
   * @param options Options to pass to the MinecraftServer
   */
  public constructor(options?: MinecraftServerOptions) {
    super();

    this.players = [];

    this.options = options ?? {};
    this.server = new Server();

    this.server.on('connection', (socket) => {
      const client = new MinecraftServerClient(socket, {
        onBeforePong: this.options.onBeforePong,
        onBeforeResponse: this.options.onBeforeResponse,
        compressionTreshold: this.options.compressionTreshold,
      });

      client.on('playing', () => {
        this.players.push(client);
        this.emit('connection', client);
      });

      client.on('disconnected', () => {
        if (!this.players.includes(client)) return;

        this.players.splice(
          this.players.findIndex((c) => c === client),
          1
        );
        this.emit('disconnection', client);
      });
    });

    this.server.listen(this.options.port ?? 25565, () => {
      this.emit('listening');
    });
  }
}

export type MinecraftServerEvents = {
  listening: () => void;
  connection: (client: MinecraftServerClient) => void;
  disconnection: (client: MinecraftServerClient) => void;
};

export interface MinecraftServerOptions {
  /** Port to listen to, defaults to `25565` */
  port?: number;
  /** Compression treshold to apply (if not specified or `-1` compression isn't enabled) */
  compressionTreshold?: number;
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
