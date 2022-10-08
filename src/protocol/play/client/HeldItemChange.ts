import { State } from '../../constants';
import { Packet } from '../../Packet';

export class HeldItemChangePacket extends Packet<HeldItemChange> {
  public static id = 0x09;
  public static state = State.PLAY;

  public write(data?: HeldItemChange): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeByte(this.data.slot);

    this.buf.finish();
  }

  public read(): HeldItemChange {
    this.data = {
      slot: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * Sent to change the player's slot selection.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Held_Item_Change
 */
interface HeldItemChange {
  /** The slot which the player has selected (0–8) */
  slot: number;
}
