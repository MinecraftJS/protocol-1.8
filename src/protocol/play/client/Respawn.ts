import { Difficulty, Dimension, GameMode, State } from '../../constants';
import { Packet } from '../../Packet';

export class RespawnPacket extends Packet<Respawn> {
  public static id = 0x07;
  public static state = State.PLAY;

  public write(data?: Respawn): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.dimension);
    this.buf.plugins.mc.writeUByte(this.data.difficulty);
    this.buf.plugins.mc.writeUByte(this.data.gamemode);
    this.buf.writeString(this.data.levelType);

    this.buf.finish();
  }

  public read(): Respawn {
    this.data = {
      dimension: this.buf.readInt(),
      difficulty: this.buf.plugins.mc.readUByte(),
      gamemode: this.buf.plugins.mc.readUByte(),
      levelType: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * To change the player's dimension (overworld/nether/end), send them a respawn
 * packet with the appropriate dimension, followed by prechunks/chunks for the
 * new dimension, and finally a position and look packet. You do not need to
 * unload chunks, the client will do it automatically.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Respawn
 */
interface Respawn {
  /** `-1`: Nether, `0`: Overworld, `1`: End */
  dimension: Dimension;
  /** 0: peaceful, 1: easy, 2: normal, 3: hard */
  difficulty: Difficulty;
  /** `0`: Survival, `1`: Creative, `2`: Adventure, `3`: Spectator. Bit 3 (`0x8`) is the hardcore flag. */
  gamemode: GameMode;
  /** Same as in JoinGamePacket */
  levelType: string;
}
