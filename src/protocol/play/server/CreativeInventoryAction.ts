import { Slot, State } from '../../constants';
import { Packet } from '../../Packet';

export class CreativeInventoryActionPacket extends Packet<CreativeInventoryAction> {
  public static id = 0x10;
  public static state = State.PLAY;

  public write(data?: CreativeInventoryAction): void {
    this.data = data || this.data;

    this.buf.writeShort(this.data.slot);
    this.buf.plugins.mc.writeSlot(this.data.clickedItem);

    this.buf.finish();
  }

  public read(): CreativeInventoryAction {
    this.data = {
      slot: this.buf.readShort(),
      clickedItem: this.buf.plugins.mc.readSlot(),
    };

    return this.data;
  }
}

/**
 * While the user is in the standard inventory (i.e., not a crafting bench) in Creative mode, the player will
 * send this packet.
 *
 * Clicking in the creative inventory menu is quite different from non-creative inventory management. Picking
 * up an item with the mouse actually deletes the item from the server, and placing an item into a slot or
 * dropping it out of the inventory actually tells the server to create the item from scratch. (This can be
 * verified by clicking an item that you don't mind deleting, then severing the connection to the server;
 * the item will be nowhere to be found when you log back in.) As a result of this implementation strategy,
 * the "Destroy Item" slot is just a client-side implementation detail that means "I don't intend to recreate
 * this item.". Additionally, the long listings of items (by category, etc.) are a client-side interface for
 * choosing which item to create. Picking up an item from such listings sends no packets to the server; only
 * when you put it somewhere does it tell the server to create the item in that location.
 *
 * This action can be described as "set inventory slot". Picking up an item sets the slot to item ID -1. Placing
 * an item into an inventory slot sets the slot to the specified item. Dropping an item (by clicking outside the
 * window) effectively sets slot -1 to the specified item, which causes the server to spawn the item entity, etc..
 * All other inventory slots are numbered the same as the non-creative inventory (including slots for the 2x2
 * crafting menu, even though they aren't visible in the vanilla client).
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Creative_Inventory_Action
 */
interface CreativeInventoryAction {
  /** Inventory slot */
  slot: number;
  clickedItem: Slot;
}
