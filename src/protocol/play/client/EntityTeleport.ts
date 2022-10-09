import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityTeleportPacket extends Packet<EntityTeleport> {
  public static id = 0x18;
  public static state = State.PLAY;

  public write(data?: EntityTeleport): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.x);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.y);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.z);
    this.buf.plugins.mc.writeAngle(this.data.yaw, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.pitch, 'degrees');
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): EntityTeleport {
    this.data = {
      entityId: this.buf.readVarInt(),
      x: this.buf.plugins.mc.readFixedPointNumber(),
      y: this.buf.plugins.mc.readFixedPointNumber(),
      z: this.buf.plugins.mc.readFixedPointNumber(),
      yaw: this.buf.plugins.mc.readAngle('degrees'),
      pitch: this.buf.plugins.mc.readAngle('degrees'),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * This packet is sent by the server when an entity rotates and moves. Since
 * a byte range is limited from `-128` to `127`, and movement is offset of
 * fixed-point numbers, this packet allows at most four blocks movement in
 * any direction. (`-128/32 == -4`)
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Look_And_Relative_Move
 */
interface EntityTeleport {
  entityId: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  onGround: boolean;
}
