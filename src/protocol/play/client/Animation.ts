import { Animation as AnimationEnum, State } from '../../constants';
import { Packet } from '../../Packet';

export class AnimationPacket extends Packet<Animation> {
  public static id = 0x0b;
  public static state = State.PLAY;

  public write(data?: Animation): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeUByte(this.data.animation);

    this.buf.finish();
  }

  public read(): Animation {
    this.data = {
      entityId: this.buf.readVarInt(),
      animation: this.buf.plugins.mc.readUByte(),
    };

    return this.data;
  }
}

/**
 * Sent whenever an entity should change animation.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Animation
 */
interface Animation {
  /** ID of the player */
  entityId: number;
  /** Animation ID */
  animation: AnimationEnum;
}
