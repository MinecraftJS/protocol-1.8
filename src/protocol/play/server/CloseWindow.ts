import { State } from '../../constants';
import { Packet } from '../../Packet';

export class CloseWindowPacket extends Packet<CloseWindow> {
  public static id = 0x0d;
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
 * This packet is sent by the client when closing a window.
 * Notchian clients send a Close Window packet with Window
 * ID 0 to close their inventory even though there is never
 * an `OpenWindowPacket`` for the inventory.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Close_Window_2
 */
interface CloseWindow {
  windowId: number;
}
