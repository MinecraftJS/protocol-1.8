import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class UsedBedPacket extends Packet<UsedBed> {
  public static id = 0x0a;
  public static state = State.PLAY;

  public write(data?: UsedBed): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writePosition(this.data.location);

    this.buf.finish();
  }

  public read(): UsedBed {
    this.data = {
      entityId: this.buf.readVarInt(),
      location: this.buf.plugins.mc.readPosition(),
    };

    return this.data;
  }
}

/**
 * This packet tells that a player goes to bed. The client
 * with the matching Entity ID will go into bed mode.
 * This Packet is sent to all nearby players including the one
 * sent to bed.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Use_Bed
 */
interface UsedBed {
  /** Entity that is using the bed */
  entityId: number;
  /** Block location of the head part of the bed */
  location: Position;
}
