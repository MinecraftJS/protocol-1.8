import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class BlockActionPacket extends Packet<BlockAction> {
  public static id = 0x25;
  public static state = State.PLAY;

  public write(data?: BlockAction): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.plugins.mc.writeByte(this.data.destroyStage);

    this.buf.finish();
  }

  public read(): BlockAction {
    this.data = {
      entityId: this.buf.readVarInt(),
      location: this.buf.plugins.mc.readPosition(),
      destroyStage: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * 0–9 are the displayable destroy stages and each other number means that there is no
 * animation on this coordinate.
 *
 * You can also set an animation to air! The animation will still be visible.
 * If you need to display several break animations at the same time you have to give each of
 * them a unique Entity ID.
 *
 * Also if you set the coordinates to a special block like water etc. it won't show the actual
 * break animation but some other interesting effects. For example, water will lose its
 * transparency.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Block_Break_Animation
 */
interface BlockAction {
  /** EID for the animation */
  entityId: number;
  /** Block Position */
  location: Position;
  /** 0–9 to set it, any other value to remove it */
  destroyStage: number;
}
