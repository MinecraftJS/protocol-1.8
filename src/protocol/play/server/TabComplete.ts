import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class TabCompletePacket extends Packet<TabComplete> {
  public static id = 0x14;
  public static state = State.PLAY;

  public write(data?: TabComplete): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.text);
    if (this.data.lookedAtBlock)
      this.buf.plugins.mc.writePosition(this.data.lookedAtBlock);

    this.buf.finish();
  }

  public read(): TabComplete {
    this.data = { text: this.buf.readString() };

    if (this.buf.readBoolean())
      this.data.lookedAtBlock = this.buf.plugins.mc.readPosition();

    return this.data;
  }
}

/**
 * Sent when the user presses tab while writing text.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Tab-Complete_2
 */
interface TabComplete {
  text: string;
  lookedAtBlock?: Position;
}
