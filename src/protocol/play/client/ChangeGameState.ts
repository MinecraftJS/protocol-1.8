import {
  ChangeGameStateDemoMessage,
  ChangeGameStateGameMode,
  ChangeGameStateReason,
  State,
} from '../../constants';
import { Packet } from '../../Packet';

export class ChangeGameStatePacket extends Packet<ChangeGameState> {
  public static id = 0x2b;
  public static state = State.PLAY;

  public write(data?: ChangeGameState): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeUByte(this.data.reason);
    this.buf.writeFloat(this.data.value);

    this.buf.finish();
  }

  public read(): ChangeGameState {
    this.data = {
      reason: this.buf.plugins.mc.readUByte(),
      value: this.buf.readFloat(),
    };

    return this.data;
  }
}

/**
 * It appears when a bed can't be used as a spawn point and when the rain state changes.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Change_Game_State
 */
interface ChangeGameState {
  reason: ChangeGameStateReason;
  /** Depends on Reason */
  value: ChangeGameStateGameMode | ChangeGameStateDemoMessage | number;
}
