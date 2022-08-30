import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PongPacket extends Packet<Pong> {
  public static id = 0x01;
  public static state = State.STATUS;

  public write(data?: Pong): void {
    this.data = data || this.data;

    this.buf.writeLong(this.data.payload);

    this.buf.finish();
  }

  public read(): Pong {
    this.data = {
      payload: this.buf.readLong(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Pong
 */
interface Pong {
  /** Should be the same as sent by the client */
  payload: number;
}
