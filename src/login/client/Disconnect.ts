import { Packet } from '../../Packet';
import { State } from '../../State';

export class ChatPacket extends Packet<Chat> {
  public static id = 0x00;
  public static state = State.LOGIN;

  public write(data?: Chat): void {
    this.data = data || this.data;

    // TODO: Parse `Chat` field type
    this.buf.writeBytes(Buffer.alloc(1));
  }

  public read(): Chat {
    this.data = {
      reason: this.buf.readBytes(1),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Disconnect_2
 */
interface Chat {
  reason: Buffer;
}
