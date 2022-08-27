import { Packet } from '../../Packet';
import { State } from '../../State';

export class LoginSuccessPacket extends Packet<LoginSuccess> {
  public static id = 0x02;
  public static state = State.LOGIN;

  public write(data?: LoginSuccess): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.UUID);
    this.buf.writeString(this.data.username);
  }

  public read(): LoginSuccess {
    this.data = {
      UUID: this.buf.readString(),
      username: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Login_Success
 */
interface LoginSuccess {
  UUID: string;
  username: string;
}
