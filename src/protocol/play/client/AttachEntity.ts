import { State } from '../../constants';
import { Packet } from '../../Packet';

export class AttachEntityPacket extends Packet<AttachEntity> {
  public static id = 0x1b;
  public static state = State.PLAY;

  public write(data?: AttachEntity): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.entityId);
    this.buf.writeInt(this.data.vehicleId);
    this.buf.writeBoolean(this.data.leash);

    this.buf.finish();
  }

  public read(): AttachEntity {
    this.data = {
      entityId: this.buf.readInt(),
      vehicleId: this.buf.readInt(),
      leash: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * This packet is sent when a player has been attached to an entity (e.g. Minecart).
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Attach_Entity
 */
interface AttachEntity {
  /** Attached entity's EID */
  entityId: number;
  /** Vechicle's Entity ID. Set to `-1` to detach */
  vehicleId: number;
  /** If true leashes the entity to the vehicle */
  leash: boolean;
}
