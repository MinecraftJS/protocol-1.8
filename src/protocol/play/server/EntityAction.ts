import { EntityAction as EntityActionEnum, State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityActionPacket extends Packet<EntityAction> {
  public static id = 0x0b;
  public static state = State.PLAY;

  public write(data?: EntityAction): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.writeVarInt(this.data.actionId);
    this.buf.writeVarInt(this.data.actionParameter || 0);

    this.buf.finish();
  }

  public read(): EntityAction {
    this.data = {
      entityId: this.buf.readVarInt(),
      actionId: this.buf.readVarInt(),
      actionParameter: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * Sent by the client to indicate that it has performed certain actions: sneaking (crouching), sprinting, exiting a bed, jumping with a horse, and opening a horse's inventory while riding it.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Action
 */
interface EntityAction {
  /** Player ID */
  entityId: number;
  /** The ID of the action, see below */
  actionId: EntityActionEnum;
  /** Only used by Horse Jump Boost, in which case it ranges from 0 to 100. In all other cases it is 0. */
  actionParameter?: number;
}
