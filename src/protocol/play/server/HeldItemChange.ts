import { State } from '../../constants';
import { Packet } from '../../Packet';

export class HeldItemChangePacket extends Packet<HeldItemChange> {
  public static id = 0x09;
  public static state = State.PLAY;

  public write(data?: HeldItemChange): void {
    this.data = data || this.data;

    this.buf.writeShort(this.data.slot);

    this.buf.finish();
  }

  public read(): HeldItemChange {
    this.data = {
      slot: this.buf.readShort(),
    };

    return this.data;
  }
}

/**
 * Sent when the player changes the slot selection
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Held_Item_Change
 */
interface HeldItemChange {
  slot: number;
}
