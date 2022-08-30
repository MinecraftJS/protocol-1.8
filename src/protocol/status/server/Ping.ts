import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PingPacket extends Packet<Ping> {
  public static id = 0x01;
  public static state = State.STATUS;

  public write(data?: Ping): void {
    this.data = data || this.data;

    this.buf.writeLong(this.data.payload);

    this.buf.finish();
  }

  public read(): Ping {
    this.data = {
      payload: this.buf.readLong(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Ping
 */
interface Ping {
  /** May be any number. Notchian clients use a system-dependent time value which is counted in milliseconds.  */
  payload: number;
}
