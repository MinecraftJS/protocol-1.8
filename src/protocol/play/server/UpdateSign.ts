import { ComponentResolvable } from '@minecraft-js/chat';
import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class UpdateSignPacket extends Packet<UpdateSign> {
  public static id = 0x12;
  public static state = State.PLAY;

  public write(data?: UpdateSign): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.plugins.mc.writeChat(this.data.line1);
    this.buf.plugins.mc.writeChat(this.data.line2);
    this.buf.plugins.mc.writeChat(this.data.line3);
    this.buf.plugins.mc.writeChat(this.data.line4);

    this.buf.finish();
  }

  public read(): UpdateSign {
    this.data = {
      location: this.buf.plugins.mc.readPosition(),
      line1: this.buf.plugins.mc.readChat(),
      line2: this.buf.plugins.mc.readChat(),
      line3: this.buf.plugins.mc.readChat(),
      line4: this.buf.plugins.mc.readChat(),
    };

    return this.data;
  }
}

/**
 * This message is sent from the client to the server when the “Done” button is pushed after placing a sign.
 * The server only accepts this packet after Open Sign Editor, otherwise this packet is silently ignored.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Update_Sign_2
 */
interface UpdateSign {
  /** Block Coordinates */
  location: Position;
  /** First line of text in the sign */
  line1: ComponentResolvable;
  /** Second line of text in the sign */
  line2: ComponentResolvable;
  /** Third line of text in the sign */
  line3: ComponentResolvable;
  /** Fourth line of text in the sign */
  line4: ComponentResolvable;
}
