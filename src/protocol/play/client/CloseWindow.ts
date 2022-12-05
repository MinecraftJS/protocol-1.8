import { State } from '../../constants';
import { Packet } from '../../Packet';

export class CloseWindowPacket extends Packet<CloseWindow> {
  public static id = 0x2e;
  public static state = State.PLAY;

  public write(data?: CloseWindow): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeUByte(this.data.windowId);

    this.buf.finish();
  }

  public read(): CloseWindow {
    this.data = {
      windowId: this.buf.plugins.mc.readUByte(),
    };

    return this.data;
  }
}

/**
 * This packet is sent from the server to the client when a window is forcibly closed,
 * such as when a chest is destroyed while it's open. Note, notchian clients send a
 * close window packet with Window ID 0 to close their inventory even though there is
 * never an Open Window packet for inventory.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Keep_Alive
 */
interface CloseWindow {
  /** This is the ID of the window that was closed. 0 for inventory. */
  windowId: number;
}
