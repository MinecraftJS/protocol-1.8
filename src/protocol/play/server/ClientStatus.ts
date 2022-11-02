import { ActionId, State } from '../../constants';
import { Packet } from '../../Packet';

export class ClientStatusPacket extends Packet<ClientStatus> {
  public static id = 0x16;
  public static state = State.PLAY;

  public write(data?: ClientStatus): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.actionId);

    this.buf.finish();
  }

  public read(): ClientStatus {
    this.data = {
      actionId: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * Sent when the client is ready to complete login and when the client is ready to respawn after death.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Client_Status
 */
interface ClientStatus {
  actionId: ActionId;
}
