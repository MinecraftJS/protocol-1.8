import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityHeadLookPacket extends Packet<EntityHeadLook> {
  public static id = 0x19;
  public static state = State.PLAY;

  public write(data?: EntityHeadLook): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeAngle(this.data.headYaw, 'degrees');

    this.buf.finish();
  }

  public read(): EntityHeadLook {
    this.data = {
      entityId: this.buf.readVarInt(),
      headYaw: this.buf.plugins.mc.readAngle('degrees'),
    };

    return this.data;
  }
}

/**
 * Changes the direction an entity's head is facing.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Head_Look
 */
interface EntityHeadLook {
  entityId: number;
  headYaw: number;
}
