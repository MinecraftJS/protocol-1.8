import { State } from '../../constants';
import { Packet } from '../../Packet';

export class RequestPacket extends Packet<Request> {
  public static id = 0x00;
  public static state = State.STATUS;

  public write(data?: Request): void {
    this.data = data || this.data;
    this.buf.finish();
  }

  public read(): Request {
    this.data = {};
    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Request
 */
interface Request {}
