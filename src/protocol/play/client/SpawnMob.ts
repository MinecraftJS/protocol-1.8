import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnMobPacket extends Packet<SpawnMob> {
  public static id = 0x0f;
  public static state = State.PLAY;

  public write(data?: SpawnMob): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.type);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.x);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.y);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.z);
    this.buf.plugins.mc.writeAngle(this.data.yaw, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.pitch, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.headPitch, 'degrees');
    this.buf.writeShort(this.data.velocityX);
    this.buf.writeShort(this.data.velocityY);
    this.buf.writeShort(this.data.velocityZ);
    this.buf.writeBytes(this.data.metadata);

    this.buf.finish();
  }

  public read(): SpawnMob {
    this.data = {
      entityId: this.buf.readVarInt(),
      type: this.buf.plugins.mc.readByte(),
      x: this.buf.plugins.mc.readFixedPointNumber(),
      y: this.buf.plugins.mc.readFixedPointNumber(),
      z: this.buf.plugins.mc.readFixedPointNumber(),
      yaw: this.buf.plugins.mc.readAngle('degrees'),
      pitch: this.buf.plugins.mc.readAngle('degrees'),
      headPitch: this.buf.plugins.mc.readAngle('degrees'),
      velocityX: this.buf.readShort(),
      velocityY: this.buf.readShort(),
      velocityZ: this.buf.readShort(),
      metadata: this.buf.readBytes(this.buf.buffer.length - this.buf.offset),
    };

    return this.data;
  }
}

/**
 * Sent by the server when a Mob Entity is Spawned
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Mob
 */
interface SpawnMob {
  entityId: number;
  /** The type of mob */
  type: number; // TODO: The type of the mob (see Entities#Mobs)
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  headPitch: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  metadata: Buffer; // TODO: Actually parse the field
}
