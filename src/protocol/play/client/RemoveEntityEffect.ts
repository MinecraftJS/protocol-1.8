import { State } from '../../constants';
import { Packet } from '../../Packet';

export class RemoveEntityEffectPacket extends Packet<RemoveEntityEffect> {
  public static id = 0x1e;
  public static state = State.PLAY;

  public write(data?: RemoveEntityEffect): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.effectId);

    this.buf.finish();
  }

  public read(): RemoveEntityEffect {
    this.data = {
      entityId: this.buf.readVarInt(),
      effectId: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Remove_Entity_Effect
 */
interface RemoveEntityEffect {
  entityId: number;
  effectId: number;
}
