import { Particle as ParticleEnum, State } from '../../constants';
import { Packet } from '../../Packet';

export class ParticlePacket extends Packet<Particle> {
  public static id = 0x2a;
  public static state = State.PLAY;

  public write(data?: Particle): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.particleId);
    this.buf.writeBoolean(this.data.longDistance);
    this.buf.writeFloat(this.data.x);
    this.buf.writeFloat(this.data.y);
    this.buf.writeFloat(this.data.z);
    this.buf.writeFloat(this.data.offsetX);
    this.buf.writeFloat(this.data.offsetY);
    this.buf.writeFloat(this.data.offsetZ);
    this.buf.writeFloat(this.data.particleData);
    this.buf.writeInt(this.data.particleCount);

    this.buf.writeVarInt(this.data.data.length);
    for (const data of this.data.data) this.buf.writeVarInt(data);

    this.buf.finish();
  }

  public read(): Particle {
    const particleId = this.buf.readInt();
    const longDistance = this.buf.readBoolean();
    const x = this.buf.readFloat();
    const y = this.buf.readFloat();
    const z = this.buf.readFloat();
    const offsetX = this.buf.readFloat();
    const offsetY = this.buf.readFloat();
    const offsetZ = this.buf.readFloat();
    const particleData = this.buf.readFloat();
    const particleCount = this.buf.readInt();

    const dataLength = this.buf.readVarInt();
    const data: number[] = [];
    for (let i = 0; i < dataLength; i++) data.push(this.buf.readVarInt());

    this.data = {
      particleId,
      longDistance,
      x,
      y,
      z,
      offsetX,
      offsetY,
      offsetZ,
      particleData,
      particleCount,
      data,
    };

    return this.data;
  }
}

/**
 * Displays the named particle
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Particle_2
 */
interface Particle {
  particleId: ParticleEnum;
  /** If true, particle distance increases from 256 to 65536 */
  longDistance: boolean;
  /** X position of the particle */
  x: number;
  /** Y position of the particle */
  y: number;
  /** Z position of the particle */
  z: number;
  /** This is added to the X position after being multiplied by random.nextGaussian() */
  offsetX: number;
  /** This is added to the Y position after being multiplied by random.nextGaussian() */
  offsetY: number;
  /** This is added to the Z position after being multiplied by random.nextGaussian() */
  offsetZ: number;
  /** The data of each particle */
  particleData: number;
  /** The number of particles to create */
  particleCount: number;
  /** Length depends on particle. "iconcrack" has length of 2, "blockcrack", and "blockdust" have lengths of 1, the rest have 0. */
  data: number[];
}
