import {
  BlockFace,
  PlayerDiggingStatus,
  Position,
  State,
} from '../../constants';
import { Packet } from '../../Packet';

export class PlayerDiggingPacket extends Packet<PlayerDigging> {
  public static id = 0x07;
  public static state = State.PLAY;

  public write(data?: PlayerDigging): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeByte(this.data.status);
    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.plugins.mc.writeByte(this.data.face);

    this.buf.finish();
  }

  public read(): PlayerDigging {
    this.data = {
      status: this.buf.plugins.mc.readByte(),
      location: this.buf.plugins.mc.readPosition(),
      face: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * Sent when the player mines a block. A Notchian server only accepts digging
 * packets with coordinates within a 6-unit radius of the player's position.
 *
 * Notchian clients send a 0 (started digging) when they start digging and a
 * 2 (finished digging) once they think they are finished. If digging is aborted,
 * the client simply send a 1 (cancel digging).
 * Status code 4 (drop item) is a special case. In-game, when you use the Drop
 * Item command (keypress 'q'), a dig packet with a status of 4, and all other
 * values set to 0, is sent from client to server. Status code 3 is similar,
 * but drops the entire stack.
 * Status code 5 (shoot arrow / finish eating) is also a special case. The x,
 * y and z fields are all set to 0 like above, with the exception of the face
 * field, which is set to 255.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Digging
 */
interface PlayerDigging {
  /** The action the player is taking against the block */
  status: PlayerDiggingStatus;
  /** Block position */
  location: Position;
  /** The face being hit (see below) */
  face: BlockFace;
}
