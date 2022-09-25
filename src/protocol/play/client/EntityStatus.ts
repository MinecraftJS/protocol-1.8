import { EntityStatus as EntityStatusEnum, State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityStatusPacket extends Packet<EntityStatus> {
  public static id = 0x1a;
  public static state = State.PLAY;

  public write(data?: EntityStatus): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.entityStatus);

    this.buf.finish();
  }

  public read(): EntityStatus {
    this.data = {
      entityId: this.buf.readVarInt(),
      entityStatus: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Status
 */
interface EntityStatus {
  entityId: number;
  entityStatus: EntityStatusEnum;
}
