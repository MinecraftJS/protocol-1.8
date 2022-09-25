import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityPacket extends Packet<Entity> {
  public static id = 0x14;
  public static state = State.PLAY;

  public write(data?: Entity): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);

    this.buf.finish();
  }

  public read(): Entity {
    this.data = {
      entityId: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * This packet may be used to initialize an entity.
 * For player entities, either this packet or any move/look packet is
 * sent every game tick. So the meaning of this packet is basically
 * that the entity did not move/look since the last such packet.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity
 */
interface Entity {
  entityId: number;
}
