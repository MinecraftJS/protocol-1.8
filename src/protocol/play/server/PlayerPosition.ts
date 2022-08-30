import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerPositionPacket extends Packet<PlayerPosition> {
  public static id = 0x04;
  public static state = State.PLAY;

  public write(data?: PlayerPosition): void {
    this.data = data || this.data;

    this.buf.writeDouble(this.data.x);
    this.buf.writeDouble(this.data.feetY);
    this.buf.writeDouble(this.data.z);
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): PlayerPosition {
    this.data = {
      x: this.buf.readDouble(),
      feetY: this.buf.readDouble(),
      z: this.buf.readDouble(),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * Updates the player's XYZ position on the server.
 * If the distance between the last known position of the player on the server and the new position set by this packet is greater than 100 units, this will result in the client being kicked for “You moved too quickly :( (Hacking?)”
 * If the distance is greater than 10 units, the server will log the warning message "<name> moved too quickly!", followed by two coordinate triples (maybe movement delta?), but will not kick the client.
 * Also if the fixed-point number of X or Z is set greater than 3.2×107 the client will be kicked for “Illegal position”.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Position
 */
interface PlayerPosition {
  /** Absolute position */
  x: number;
  /** Absolute position, normally Head Y - 1.62 */
  feetY: number;
  /** Absolute position */
  z: number;
  /** True if the client is on the ground, false otherwise */
  onGround: boolean;
}
