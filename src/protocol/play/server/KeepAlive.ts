import { State } from '../../constants';
import { Packet } from '../../Packet';

export class KeepAlivePacket extends Packet<KeepAlive> {
  public static id = 0x00;
  public static state = State.PLAY;

  public write(data?: KeepAlive): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.id);

    this.buf.finish();
  }

  public read(): KeepAlive {
    this.data = {
      id: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * The server will frequently send out a keep-alive, each containing a random ID.
 * The client must respond with the same packet.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Keep_Alive
 */
interface KeepAlive {
  /** Username of the player */
  id: number;
}
