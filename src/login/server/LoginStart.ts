import { Packet } from '../../Packet';
import { State } from '../../State';

export class LoginStartPacket extends Packet<LoginStart> {
  public static id = 0x00;
  public static state = State.LOGIN;

  public write(data?: LoginStart): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.name);
  }

  public read(): LoginStart {
    this.data = {
      name: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Login_Start
 */
interface LoginStart {
  /** Username of the player */
  name: string;
}
