import { BlockFace, Position, Slot, State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerBlockPlacementPacket extends Packet<PlayerBlockPlacement> {
  public static id = 0x08;
  public static state = State.PLAY;

  public write(data?: PlayerBlockPlacement): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.plugins.mc.writeByte(this.data.face);
    this.buf.plugins.mc.writeSlot(this.data.heldItem);
    this.buf.plugins.mc.writeByte(this.data.cursorPositionX);
    this.buf.plugins.mc.writeByte(this.data.cursorPositionY);
    this.buf.plugins.mc.writeByte(this.data.cursorPositionZ);

    this.buf.finish();
  }

  public read(): PlayerBlockPlacement {
    this.data = {
      location: this.buf.plugins.mc.readPosition(),
      face: this.buf.plugins.mc.readByte(),
      heldItem: this.buf.plugins.mc.readSlot(),
      cursorPositionX: this.buf.plugins.mc.readByte(),
      cursorPositionY: this.buf.plugins.mc.readByte(),
      cursorPositionZ: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * In normal operation (i.e. placing a block), this packet is sent once, with the values set normally.
 * This packet has a special case where X, Y, Z, and Face are all -1. (Note that Y is unsigned so set to 255.) This special packet indicates that the currently held item for the player should have its state updated such as eating food, pulling back bows, using buckets, etc.
 * In a Notchian Beta client, the block or item ID corresponds to whatever the client is currently holding, and the client sends one of these packets any time a right-click is issued on a surface, so no assumptions can be made about the safety of the ID. However, with the implementation of server-side inventory, a Notchian server seems to ignore the item ID, instead operating on server-side inventory information and holding selection. The client has been observed (1.2.5 and 1.3.2) to send both real item IDs and -1 in a single session.
 * Special note on using buckets: When using buckets, the Notchian client might send two packets: first a normal and then a special case. The first normal packet is sent when you're looking at a block (e.g. the water you want to scoop up). This normal packet does not appear to do anything with a Notchian server. The second, special case packet appears to perform the action — based on current position/orientation and with a distance check — it appears that buckets can only be used within a radius of 6 units.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Block_Placement
 */
interface PlayerBlockPlacement {
  /** Block position */
  location: Position;
  /** The face on which the block is placed */
  face: BlockFace;
  heldItem: Slot;
  /** The position of the crosshair on the block */
  cursorPositionX: number;
  /** The position of the crosshair on the block */
  cursorPositionY: number;
  /** The position of the crosshair on the block */
  cursorPositionZ: number;
}
