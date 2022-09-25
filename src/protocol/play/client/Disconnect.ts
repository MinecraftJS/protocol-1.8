import { ComponentResolvable } from '@minecraft-js/chat';
import { State } from '../../constants';
import { Packet } from '../../Packet';

export class Disconnect2Packet extends Packet<Disconnect2> {
  public static id = 0x40;
  public static state = State.PLAY;

  public write(data?: Disconnect2): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeChat(this.data.reason);

    this.buf.finish();
  }

  public read(): Disconnect2 {
    this.data = {
      reason: this.buf.plugins.mc.readChat(),
    };

    return this.data;
  }
}

/**
 * Sent by the server before it disconnects a client. The client assumes that the server has already closed the connection by the time the packet arrives.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Disconnect
 */
interface Disconnect2 {
  /** Displayed to the client when the connection terminates. */
  reason: ComponentResolvable;
}
