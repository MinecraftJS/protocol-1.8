import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnObjectPacket extends Packet<SpawnObject> {
  public static id = 0x0e;
  public static state = State.PLAY;

  public write(data?: SpawnObject): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.type);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.x);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.y);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.z);
    this.buf.plugins.mc.writeAngle(this.data.yaw, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.pitch, 'degrees');
    this.buf.writeInt(this.data.data);

    if (this.data.data !== 0) {
      this.buf.writeShort(this.data.velocityX);
      this.buf.writeShort(this.data.velocityY);
      this.buf.writeShort(this.data.velocityZ);
    }

    this.buf.finish();
  }

  public read(): SpawnObject {
    this.data = {
      entityId: this.buf.readVarInt(),
      type: this.buf.plugins.mc.readByte(),
      x: this.buf.plugins.mc.readFixedPointNumber(),
      y: this.buf.plugins.mc.readFixedPointNumber(),
      z: this.buf.plugins.mc.readFixedPointNumber(),
      yaw: this.buf.plugins.mc.readAngle('degrees'),
      pitch: this.buf.plugins.mc.readAngle('degrees'),
      data: this.buf.readInt(),
    };

    if (this.data.data !== 0) {
      this.data.velocityX = this.buf.readShort();
      this.data.velocityY = this.buf.readShort();
      this.data.velocityZ = this.buf.readShort();
    }

    return this.data;
  }
}

/**
 * Sent by the server when a vehicle or other object is created.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Object
 */
interface SpawnObject {
  /** Object's entity id */
  entityId: number;
  /** The type of the object */
  type: number; // TODO: The type of object (see Entities#Objects)
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  /**
   * Meaning dependent on the value of the Type
   * field, see Object Data for details.
   */
  data: number;
  /** Only sent if the `data` field is nonzero */
  velocityX?: number;
  /** Only sent if the `data` field is nonzero */
  velocityY?: number;
  /** Only sent if the `data` field is nonzero */
  velocityZ?: number;
}
