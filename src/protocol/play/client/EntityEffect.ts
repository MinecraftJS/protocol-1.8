import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityEffectPacket extends Packet<EntityEffect> {
  public static id = 0x1d;
  public static state = State.PLAY;

  public write(data?: EntityEffect): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.effectId);
    this.buf.plugins.mc.writeByte(this.data.amplifier);
    this.buf.writeVarInt(this.data.duration);
    this.buf.writeBoolean(this.data.hideParticles);

    this.buf.finish();
  }

  public read(): EntityEffect {
    this.data = {
      entityId: this.buf.readVarInt(),
      effectId: this.buf.plugins.mc.readByte(),
      amplifier: this.buf.plugins.mc.readByte(),
      duration: this.buf.readVarInt(),
      hideParticles: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Effect
 */
interface EntityEffect {
  entityId: number;
  effectId: number;
  /** Notchian client displays effect level as Amplifier + 1 */
  amplifier: number;
  /** Duration in seconds */
  duration: number;
  hideParticles: boolean;
}
