import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityVelocitityPacket extends Packet<EntityVelocitity> {
  public static id = 0x12;
  public static state = State.PLAY;

  public write(data?: EntityVelocitity): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.writeShort(this.data.velocityX);
    this.buf.writeShort(this.data.velocityY);
    this.buf.writeShort(this.data.velocityZ);

    this.buf.finish();
  }

  public read(): EntityVelocitity {
    this.data = {
      entityId: this.buf.readVarInt(),
      velocityX: this.buf.readShort(),
      velocityY: this.buf.readShort(),
      velocityZ: this.buf.readShort(),
    };

    return this.data;
  }
}

/**
 * Velocity is believed to be in units of `1/8000` of a block per server tick
 * (50ms); for example, `-1343` would move (`-1343 / 8000`) = `−0.167875` blocks
 * per tick (or `−3,3575` blocks per second).
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Velocity
 */
interface EntityVelocitity {
  entityId: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
}
