import { State, UseEntityType } from '../../constants';
import { Packet } from '../../Packet';

export class UseEntityPacket extends Packet<UseEntity> {
  public static id = 0x02;
  public static state = State.PLAY;

  public write(data?: UseEntity): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.target);
    this.buf.writeVarInt(this.data.type);

    if (this.data.type === UseEntityType.INTERACT_AT) {
      this.buf.writeFloat(this.data.targetX);
      this.buf.writeFloat(this.data.targetY);
      this.buf.writeFloat(this.data.targetZ);
    }

    this.buf.finish();
  }

  public read(): UseEntity {
    this.data = {
      target: this.buf.readVarInt(),
      type: this.buf.readVarInt(),
    };

    if (this.data.type === UseEntityType.INTERACT_AT) {
      this.data.targetX = this.buf.readFloat();
      this.data.targetY = this.buf.readFloat();
      this.data.targetZ = this.buf.readFloat();
    }

    return this.data;
  }
}

/**
 * This packet is sent from the client to the server when the client
 * attacks or right-clicks another entity (a player, minecart, etc).
 * A Notchian server only accepts this packet if the entity being
 * attacked/used is visible without obstruction and within a 4-unit
 * radius of the player's position.
 * Note that middle-click in creative mode is interpreted by the
 * client and sent as a Creative Inventory Action packet instead.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Use_Entity
 */
interface UseEntity {
  target: number;
  type: UseEntityType;
  /** Only if Type is interact at */
  targetX?: number;
  /** Only if Type is interact at */
  targetY?: number;
  /** Only if Type is interact at */
  targetZ?: number;
}
