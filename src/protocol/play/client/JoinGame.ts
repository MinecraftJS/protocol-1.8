import {
  Difficulty,
  Dimension,
  GameMode,
  LevelType,
  State,
} from '../../constants';
import { Packet } from '../../Packet';

export class JoinGamePacket extends Packet<JoinGame> {
  public static id = 0x01;
  public static state = State.PLAY;

  public write(data?: JoinGame): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.entityId);
    this.buf.writeBytes([this.data.gamemode]);

    const dimensionBuf = Buffer.alloc(1);
    dimensionBuf.writeInt8(this.data.dimension);
    this.buf.writeBytes(dimensionBuf);

    this.buf.writeBytes([this.data.difficulty, this.data.maxPlayers]);
    this.buf.writeString(this.data.levelType);
    this.buf.writeBoolean(this.data.reducedDebugInfo);

    this.buf.finish();
  }

  public read(): JoinGame {
    this.data = {
      entityId: this.buf.readVarInt(),
      gamemode: this.buf.readBytes(1)[0] as JoinGame['gamemode'],
      dimension: this.buf.readBytes(1).readInt8() as JoinGame['dimension'],
      difficulty: this.buf.readBytes(1)[0] as JoinGame['difficulty'],
      maxPlayers: this.buf.readBytes(1)[0],
      levelType: this.buf.readString() as JoinGame['levelType'],
      reducedDebugInfo: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Join_Game
 */
interface JoinGame {
  /** The player's Entity ID (EID) */
  entityId: number;
  /** `0`: Survival, `1`: Creative, `2`: Adventure, `3`: Spectator. Bit 3 (`0x8`) is the hardcore flag. */
  gamemode: GameMode;
  /** `-1`: Nether, `0`: Overworld, `1`: End */
  dimension: Dimension;
  /** 0: peaceful, 1: easy, 2: normal, 3: hard */
  difficulty: Difficulty;
  /** Used by the client to draw the player list */
  maxPlayers: number;
  /** `default`, `flat`, `largeBiomes`, `amplified`, `default_1_1` */
  levelType: LevelType;
  /** If true, a Notchian client shows reduced information on the debug screen. */
  reducedDebugInfo: boolean;
}