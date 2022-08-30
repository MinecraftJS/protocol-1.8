import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerPositionAndLookPacket extends Packet<PlayerPositionAndLook> {
  public static id = 0x06;
  public static state = State.PLAY;

  public write(data?: PlayerPositionAndLook): void {
    this.data = data || this.data;

    this.buf.writeDouble(this.data.x);
    this.buf.writeDouble(this.data.feetY);
    this.buf.writeDouble(this.data.z);
    this.buf.writeFloat(this.data.yaw);
    this.buf.writeFloat(this.data.pitch);
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): PlayerPositionAndLook {
    this.data = {
      x: this.buf.readDouble(),
      feetY: this.buf.readDouble(),
      z: this.buf.readDouble(),
      yaw: this.buf.readFloat(),
      pitch: this.buf.readFloat(),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * A combination of [Player Look](./PlayerLook.ts) and [Player Position](./PlayerPosition.ts).
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Position_And_Look_2
 */
interface PlayerPositionAndLook {
  /** Absolute position */
  x: number;
  /** Absolute position, normally Head Y - 1.62 */
  feetY: number;
  /** Absolute position */
  z: number;
  /** Absolute rotation on the X Axis, in degrees */
  yaw: number;
  /** Absolute rotation on the Y Axis, in degrees */
  pitch: number;
  /** True if the client is on the ground, false otherwise */
  onGround: boolean;
}
