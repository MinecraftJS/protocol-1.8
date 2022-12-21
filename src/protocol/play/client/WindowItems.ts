import { Slot, State } from '../../constants';
import { Packet } from '../../Packet';

export class WindowItemsPacket extends Packet<WindowItems> {
  public static id = 0x30;
  public static state = State.PLAY;

  public write(data?: WindowItems): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeByte(this.data.windowId);
    this.buf.writeShort(this.data.slots.length);
    for (const slot of this.data.slots) this.buf.plugins.mc.writeSlot(slot);

    this.buf.finish();
  }

  public read(): WindowItems {
    const windowId = this.buf.plugins.mc.readByte();
    const slotLength = this.buf.readShort();
    const slots: Slot[] = [];
    for (let i = 0; i < slotLength; i++)
      slots.push(this.buf.plugins.mc.readSlot());

    this.data = { windowId, slots };

    return this.data;
  }
}

/**
 * Sent by the server when items in multiple slots (in a window) are added/removed. This includes the main inventory, equipped armour and crafting slots.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Window_Items
 */
interface WindowItems {
  /** The ID of window which items are being sent for. `0` for player inventory. */
  windowId: number;
  slots: Slot[];
}
