import { State } from '../../constants';
import { Packet } from '../../Packet';

export class AnimationPacket extends Packet<Animation> {
  public static id = 0x0a;
  public static state = State.PLAY;

  public write(data?: Animation): void {
    this.data = data || this.data;

    this.buf.finish();
  }

  public read(): Animation {
    this.data = {};

    return this.data;
  }
}

/**
 * Sent when the player's arm swings
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Animation_2
 */
interface Animation {}
