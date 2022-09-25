import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityLookPacket extends Packet<EntityLook> {
  public static id = 0x16;
  public static state = State.PLAY;

  public write(data?: EntityLook): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeAngle(this.data.yaw, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.pitch, 'degrees');
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): EntityLook {
    this.data = {
      entityId: this.buf.readVarInt(),
      yaw: this.buf.plugins.mc.readAngle('degrees'),
      pitch: this.buf.plugins.mc.readAngle('degrees'),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * This packet is sent by the server when an entity rotates.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Look
 */
interface EntityLook {
  entityId: number;
  yaw: number;
  pitch: number;
  onGround: boolean;
}
