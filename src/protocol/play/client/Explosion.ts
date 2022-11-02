import { State } from '../../constants';
import { Packet } from '../../Packet';

export class ExplosionPacket extends Packet<Explosion> {
  public static id = 0x27;
  public static state = State.PLAY;

  public write(data?: Explosion): void {
    this.data = data || this.data;

    this.buf.writeFloat(this.data.x);
    this.buf.writeFloat(this.data.y);
    this.buf.writeFloat(this.data.z);
    this.buf.writeFloat(this.data.radius);

    this.buf.writeInt(this.data.records.length);
    for (const record of this.data.records) {
      this.buf.plugins.mc.writeByte(record.x);
      this.buf.plugins.mc.writeByte(record.y);
      this.buf.plugins.mc.writeByte(record.z);
    }

    this.buf.writeFloat(this.data.playerMotionX);
    this.buf.writeFloat(this.data.playerMotionY);
    this.buf.writeFloat(this.data.playerMotionZ);

    this.buf.finish();
  }

  public read(): Explosion {
    const x = this.buf.readFloat();
    const y = this.buf.readFloat();
    const z = this.buf.readFloat();
    const radius = this.buf.readFloat();

    const recordsLength = this.buf.readInt();
    const records: Explosion['records'] = [];
    for (let i = 0; i < recordsLength; i++)
      records.push({
        x: this.buf.plugins.mc.readByte(),
        y: this.buf.plugins.mc.readByte(),
        z: this.buf.plugins.mc.readByte(),
      });

    const playerMotionX = this.buf.readFloat();
    const playerMotionY = this.buf.readFloat();
    const playerMotionZ = this.buf.readFloat();

    this.data = {
      x,
      y,
      z,
      radius,
      records,
      playerMotionX,
      playerMotionY,
      playerMotionZ,
    };

    return this.data;
  }
}

/**
 * Sent when an explosion occurs (creepers, TNT, and ghast fireballs).
 * Each block in Records is set to air. Coordinates for each axis in record is int(X) + record.x
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Explosion
 */
interface Explosion {
  x: number;
  y: number;
  z: number;
  /** Currently unused in the client */
  radius: number;
  /** Each record is 3 signed bytes long, each bytes are the XYZ (respectively) offsets of affected blocks. */
  records: {
    x: number;
    y: number;
    z: number;
  }[];
  /** X velocity of the player being pushed by the explosion */
  playerMotionX: number;
  /** Y velocity of the player being pushed by the explosion */
  playerMotionY: number;
  /** Z velocity of the player being pushed by the explosion */
  playerMotionZ: number;
}
