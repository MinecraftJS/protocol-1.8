import { State } from '../../constants';
import { Packet } from '../../Packet';

export class DisconnectPacket extends Packet<Disconnect> {
  public static id = 0x00;
  public static state = State.LOGIN;

  public write(data?: Disconnect): void {
    this.data = data || this.data;

    // TODO: Parse `Chat` field type
    this.buf.writeBytes(Buffer.alloc(1));

    this.buf.finish();
  }

  public read(): Disconnect {
    this.data = {
      reason: this.buf.readBytes(1),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Disconnect_2
 */
interface Disconnect {
  reason: Buffer;
}
