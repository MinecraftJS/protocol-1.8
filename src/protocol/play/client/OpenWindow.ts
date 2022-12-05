import { ComponentResolvable } from '@minecraft-js/chat';
import { State, WindowType } from '../../constants';
import { Packet } from '../../Packet';

export class OpenWindowPacket extends Packet<OpenWindow> {
  public static id = 0x2d;
  public static state = State.PLAY;

  public write(data?: OpenWindow): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeUByte(this.data.windowId);
    this.buf.writeString(this.data.windowType);
    this.buf.plugins.mc.writeChat(this.data.windowTitle);
    this.buf.plugins.mc.writeUByte(this.data.numberOfSlots);
    if (this.data.entityId) this.buf.writeInt(this.data.entityId);

    this.buf.finish();
  }

  public read(): OpenWindow {
    this.data = {
      windowId: this.buf.plugins.mc.readUByte(),
      windowType: this.buf.readString() as WindowType,
      windowTitle: this.buf.plugins.mc.readChat(),
      numberOfSlots: this.buf.plugins.mc.readUByte(),
    };

    if (this.data.windowType === WindowType.HORSE)
      this.data.entityId = this.buf.readInt();

    return this.data;
  }
}

/**
 * This is sent to the client when it should open an inventory, such as a chest,
 * workbench, or furnace. This message is not sent anywhere for clients opening
 * their own inventory.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Open_Window
 */
interface OpenWindow {
  /** A unique id number for the window to be displayed. Notchian server implementation is a counter, starting at 1. */
  windowId: number;
  /** The window type to use for display. */
  windowType: WindowType;
  /** The title of the window */
  windowTitle: ComponentResolvable;
  /** Number of slots in the window (excluding the number of slots in the player inventory) */
  numberOfSlots: number;
  /** EntityHorse's EID. Only sent when Window Type is “EntityHorse” */
  entityId?: number;
}
