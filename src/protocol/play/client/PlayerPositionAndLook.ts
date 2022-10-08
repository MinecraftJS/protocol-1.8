import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerPositionAndLookPacket extends Packet<PlayerPositionAndLook> {
  public static id = 0x08;
  public static state = State.PLAY;

  public write(data?: PlayerPositionAndLook): void {
    this.data = data || this.data;

    this.buf.writeDouble(this.data.x);
    this.buf.writeDouble(this.data.y);
    this.buf.writeDouble(this.data.z);
    this.buf.writeFloat(this.data.yaw);
    this.buf.writeFloat(this.data.pitch);
    this.buf.plugins.mc.writeByte(this.data.flags);

    this.buf.finish();
  }

  public read(): PlayerPositionAndLook {
    this.data = {
      x: this.buf.readDouble(),
      y: this.buf.readDouble(),
      z: this.buf.readDouble(),
      yaw: this.buf.readFloat(),
      pitch: this.buf.readFloat(),
      flags: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * Updates the player's position on the server. This packet will also close
 * the "Downloading Terrain" screen when joining/respawning.
 *
 * If the distance between the last known position of the player on the server
 * and the new position set by this packet is greater than 100 meters, the client
 * will be kicked for “You moved too quickly :( (Hacking?)”.
 *
 * Also if the fixed-point number of X or Z is set greater than `3.2E7D` the client
 * will be kicked for “Illegal position”.
 *
 * Yaw is measured in degrees, and does not follow classical trigonometry rules.
 * The unit circle of yaw on the XZ-plane starts at (0, 1) and turns counterclockwise,
 * with 90 at (-1, 0), 180 at (0, -1) and 270 at (1, 0). Additionally, yaw is not
 * clamped to between 0 and 360 degrees; any number is valid, including negative
 * numbers and numbers greater than 360.
 *
 * Pitch is measured in degrees, where 0 is looking straight ahead, -90 is looking
 * straight up, and 90 is looking straight down.
 *
 * The yaw and pitch of player (in degrees), standing at point (x0, y0, z0) and
 * looking towards point (x, y, z) one can be calculated with:
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Position_And_Look
 */
interface PlayerPositionAndLook {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  flags: number;
}
