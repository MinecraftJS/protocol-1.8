import { ClickWindowMode, Slot, State } from '../../constants';
import { Packet } from '../../Packet';

export class ClickWindowPacket extends Packet<ClickWindow> {
  public static id = 0x0e;
  public static state = State.PLAY;

  public write(data?: ClickWindow): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeUByte(this.data.windowId);
    this.buf.writeShort(this.data.slot);
    this.buf.plugins.mc.writeByte(this.data.button);
    this.buf.writeShort(this.data.actionNumber);
    this.buf.plugins.mc.writeByte(this.data.mode);
    this.buf.plugins.mc.writeSlot(this.data.clickedItem);

    this.buf.finish();
  }

  public read(): ClickWindow {
    this.data = {
      windowId: this.buf.plugins.mc.readUByte(),
      slot: this.buf.readShort(),
      button: this.buf.plugins.mc.readByte(),
      actionNumber: this.buf.readShort(),
      mode: this.buf.plugins.mc.readByte(),
      clickedItem: this.buf.plugins.mc.readSlot(),
    };

    return this.data;
  }
}

/**
 * This packet is sent by the player when it clicks on a slot in a window.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Click_Window
 */
interface ClickWindow {
  /** The ID of the window which was clicked. 0 for player inventory. */
  windowId: number;
  /** The clicked slot number */
  slot: number;
  /** The button used in the click */
  button: number;
  /** A unique number for the action, implemented by Notchian as a counter, starting at 1. Used by the server to send back a Confirm Transaction. */
  actionNumber: number;
  /** Inventory operation mode */
  mode: ClickWindowMode;
  /** The clicked slot. Has to be empty (item ID = `-1`) for drop mode. */
  clickedItem: Slot;
}
