import { Slot, State } from '../../constants';
import { Packet } from '../../Packet';

export class SetSlotPacket extends Packet<SetSlot> {
  public static id = 0x2f;
  public static state = State.PLAY;

  public write(data?: SetSlot): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeByte(this.data.windowId);
    this.buf.writeShort(this.data.slot);
    this.buf.plugins.mc.writeSlot(this.data.slotData);

    this.buf.finish();
  }

  public read(): SetSlot {
    this.data = {
      windowId: this.buf.plugins.mc.readByte(),
      slot: this.buf.readShort(),
      slotData: this.buf.plugins.mc.readSlot(),
    };

    return this.data;
  }
}

/**
 * Sent by the server when an item in a slot (in a window) is added/removed.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Set_Slot
 */
interface SetSlot {
  /**
   * The window which is being updated. 0 for player inventory. Note
   * that all known window types include the player inventory. This
   * packet will only be sent for the currently opened window while
   * the player is performing actions, even if it affects the player
   * inventory. After the window is closed, a number of these packets
   * are sent to update the player's inventory window (0).
   */
  windowId: number;
  /** The slot that should be updated */
  slot: number;
  slotData: Slot;
}
