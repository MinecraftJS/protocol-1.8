import { State, Effect as EffectEnum, Position } from '../../constants';
import { Packet } from '../../Packet';

export class EffectPacket extends Packet<Effect> {
  public static id = 0x28;
  public static state = State.PLAY;

  public write(data?: Effect): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.effectId);
    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.writeInt(this.data.data);
    this.buf.writeBoolean(this.data.disableRelativeVolume);

    this.buf.finish();
  }

  public read(): Effect {
    this.data = {
      effectId: this.buf.readInt(),
      location: this.buf.plugins.mc.readPosition(),
      data: this.buf.readInt(),
      disableRelativeVolume: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * Sent when a client is to play a sound or particle effect.
 *
 * By default, the Minecraft client adjusts the volume of sound effects
 * based on distance. The final boolean field is used to disable this,
 * and instead the effect is played from 2 blocks away in the correct
 * direction. Currently this is only used for effect 1013 (mob.wither.spawn),
 * and is ignored for any other value by the client.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Effect
 */
interface Effect {
  /** The ID of the effect */
  effectId: EffectEnum;
  /** The location of the effect */
  location: Position;
  /** Extra data for certain effects */
  data: number;
  disableRelativeVolume: boolean;
}
