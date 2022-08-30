import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerPacket extends Packet<Player> {
  public static id = 0x03;
  public static state = State.PLAY;

  public write(data?: Player): void {
    this.data = data || this.data;

    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): Player {
    this.data = {
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * This packet as well as Player Position (Play, 0x04, serverbound), Player Look (Play, 0x05, serverbound), and Player Position And Look (Play, 0x06, serverbound) are called the “serverbound movement packets”. At least one of them must be sent on each tick to ensure that servers will update things like player health correctly. Vanilla clients will send Player Position once every 20 ticks even for a stationary player, and Player on every other tick.
 * This packet is used to indicate whether the player is on ground (walking/swimming), or airborne (jumping/falling).
 * When dropping from sufficient height, fall damage is applied when this state goes from false to true. The amount of damage applied is based on the point where it last changed from true to false. Note that there are several movement related packets containing this state.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player
 */
interface Player {
  /** True if the client is on the ground, false otherwise */
  onGround: boolean;
}
