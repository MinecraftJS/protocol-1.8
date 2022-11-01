import { State } from '../../constants';
import { Packet } from '../../Packet';

export class ConfirmTransactionPacket extends Packet<ConfirmTransaction> {
  public static id = 0x0f;
  public static state = State.PLAY;

  public write(data?: ConfirmTransaction): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeUByte(this.data.windowId);
    this.buf.writeShort(this.data.actionNumber);
    this.buf.writeBoolean(this.data.accepted);

    this.buf.finish();
  }

  public read(): ConfirmTransaction {
    this.data = {
      windowId: this.buf.plugins.mc.readUByte(),
      actionNumber: this.buf.readShort(),
      accepted: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * If a transaction sent by the client was not accepted, the server will reply with a Confirm Transaction
 * (Play, 0x32, clientbound) packet with the Accepted field set to false. When this happens, the client
 * must reflect the packet to apologize (as with movement), otherwise the server ignores any successive
 * transactions.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Confirm_Transaction_2
 */
interface ConfirmTransaction {
  /** The ID of the window that the action occurred in */
  windowId: number;
  /** Every action that is to be accepted has a unique number. This field corresponds to that number. */
  actionNumber: number;
  /** Whether the action was accepted */
  accepted: boolean;
}
