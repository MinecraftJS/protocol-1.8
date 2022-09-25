import { State } from '../../constants';
import { Packet } from '../../Packet';

export class HandshakePacket extends Packet<Handshake> {
  public static id = 0x00;
  public static state = State.HANDSHAKING;

  public write(data?: Handshake): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.protocolVersion);
    this.buf.writeString(this.data.serverAddress);
    this.buf.plugins.mc.writeUShort(this.data.serverPort);

    this.buf.writeVarInt(this.data.nextState);

    this.buf.finish();
  }

  public read(): Handshake {
    this.data = {
      protocolVersion: this.buf.readVarInt(),
      serverAddress: this.buf.readString(),
      serverPort: this.buf.plugins.mc.readUShort(),
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
