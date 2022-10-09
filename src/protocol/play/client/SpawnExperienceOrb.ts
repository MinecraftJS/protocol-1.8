import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnExperienceOrbPacket extends Packet<SpawnExperienceOrb> {
  public static id = 0x11;
  public static state = State.PLAY;

  public write(data?: SpawnExperienceOrb): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.x);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.y);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.z);
    this.buf.writeShort(this.data.count);

    this.buf.finish();
  }

  public read(): SpawnExperienceOrb {
    this.data = {
      entityId: this.buf.readVarInt(),
      x: this.buf.plugins.mc.readFixedPointNumber(),
      y: this.buf.plugins.mc.readFixedPointNumber(),
      z: this.buf.plugins.mc.readFixedPointNumber(),
      count: this.buf.readShort(),
    };

    return this.data;
  }
}

/**
 * Spawns one or more experience orbs.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Experience_Orb
 */
interface SpawnExperienceOrb {
  entityId: number;
  x: number;
  y: number;
  z: number;
  /** The amount of experience this orb will reward once collected */
  count: number;
}
