import { Packet } from '../../Packet';
import { State } from '../../State';

export class HandshakePacket extends Packet<Handshake> {
  public static id = 0x00;
  public static state = State.HANDSHAKING;

  public write(data?: Handshake): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.protocolVersion);
    this.buf.writeString(this.data.serverAddress);

    // @minecraft-js/BufWrapper doesn't support unsigned shorts
    let serverPortBuf = Buffer.alloc(2);
    serverPortBuf.writeUInt16BE(this.data.serverPort);
    this.buf.writeBytes(serverPortBuf);

    this.buf.writeVarInt(this.data.nextState);
  }

  public read(): Handshake {
    this.data = {
      protocolVersion: this.buf.readVarInt(),
      serverAddress: this.buf.readString(),
      serverPort: this.buf.readBytes(2).readUInt16BE(),
      nextState: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * This causes the server to switch into the target state.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Handshake
 */
interface Handshake {
  /** See [protocol version](https://wiki.vg/Protocol_version_numbers) numbers (currently 47 in Minecraft 1.8). */
  protocolVersion: number;
  /**
   * Hostname or IP, e.g. localhost or 127.0.0.1, that was used to connect. The Notchian server does not use this information.
   * Note that SRV records are a simple redirect, e.g. if _minecraft._tcp.example.com points to mc.example.org,
   * users connecting to example.com will provide example.org as server address in addition to connecting to it.
   */
  serverAddress: string;
  /** Default is 25565. The Notchian server does not use this information. */
  serverPort: number;
  /** 1 for [Status](https://wiki.vg/Protocol#Status), 2 for [Login](https://wiki.vg/Protocol#Login). */
  nextState: number;
}
