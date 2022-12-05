import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnGlobalEntityPacket extends Packet<SpawnGlobalEntity> {
  public static id = 0x2c;
  public static state = State.PLAY;

  public write(data?: SpawnGlobalEntity): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.entityId);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.X);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.Y);
    this.buf.plugins.mc.writeFixedPointNumber(this.data.Z);

    this.buf.finish();
  }

  public read(): SpawnGlobalEntity {
    this.data = {
      entityId: this.buf.readVarInt(),
      type: this.buf.plugins.mc.readUByte(),
      X: this.buf.plugins.mc.readFixedPointNumber(),
      Y: this.buf.plugins.mc.readFixedPointNumber(),
      Z: this.buf.plugins.mc.readFixedPointNumber(),
    };

    return this.data;
  }
}

/**
 * With this packet, the server notifies the client of thunderbolts striking within a
 * 512 block radius around the player. The coordinates specify where exactly the
 * thunderbolt strikes.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Global_Entity
 */
interface SpawnGlobalEntity {
  /** The EID of the thunderbolt */
  entityId: number;
  /** The global entity type, currently always 1 for thunderbolt */
  type: number;
  /** Thunderbolt X */
  X: number;
  /** Thunderbolt Y */
  Y: number;
  /** Thunderbolt Z */
  Z: number;
}
