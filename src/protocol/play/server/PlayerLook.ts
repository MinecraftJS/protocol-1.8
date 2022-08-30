import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerLookPacket extends Packet<PlayerLook> {
  public static id = 0x05;
  public static state = State.PLAY;

  public write(data?: PlayerLook): void {
    this.data = data || this.data;

    this.buf.writeFloat(this.data.yaw);
    this.buf.writeFloat(this.data.pitch);
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): PlayerLook {
    this.data = {
      yaw: this.buf.readFloat(),
      pitch: this.buf.readFloat(),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * Updates the direction the player is looking in.
 * Yaw is measured in degrees, and does not follow classical trigonometry rules. The unit circle of yaw on the XZ-plane starts at (0, 1) and turns counterclockwise, with 90 at (-1, 0), 180 at (0,-1) and 270 at (1, 0). Additionally, yaw is not clamped to between 0 and 360 degrees; any number is valid, including negative numbers and numbers greater than 360.
 * Pitch is measured in degrees, where 0 is looking straight ahead, -90 is looking straight up, and 90 is looking straight down.
 * The yaw and pitch of player (in degrees), standing at point (x0, y0, z0) and looking towards point (x, y, z) one can be calculated with:
 * ```text
 * dx = x-x0
 * dy = y-y0
 * dz = z-z0
 * r = sqrt( dx*dx + dy*dy + dz*dz )
 * yaw = -atan2(dx,dz)/PI*180
 * if yaw < 0 then
 *     yaw = 360 - yaw
 * pitch = -arcsin(dy/r)/PI*180
 * ```
 * You can get a unit vector from a given yaw/pitch via:
 * ```text
 * x = -cos(pitch) * sin(yaw)
 * y = -sin(pitch)
 * z =  cos(pitch) * cos(yaw)
 * ```
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Look
 */
interface PlayerLook {
  /** Absolute rotation on the X Axis, in degrees */
  yaw: number;
  /** Absolute rotation on the Y Axis, in degrees */
  pitch: number;
  /** True if the client is on the ground, false otherwise */
  onGround: boolean;
}
