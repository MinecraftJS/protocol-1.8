import { State } from '../../constants';
import { Packet } from '../../Packet';

export class PluginMessagePacket extends Packet<PluginMessage> {
  public static id = 0x3f;
  public static state = State.PLAY;

  public write(data?: PluginMessage): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.channel);
    this.buf.writeBytes(this.data.data);

    this.buf.finish();
  }

  public read(): PluginMessage {
    this.data = {
      channel: this.buf.readString(),
      data: this.buf.readBytes(this.buf.buffer.length - this.buf.offset),
    };

    return this.data;
  }
}

/**
 * Mods and plugins can use this to send their data. Minecraft itself uses a number of plugin channels. These internal channels are prefixed with `MC|`.
 * More documentation on this: http://dinnerbone.com/blog/2012/01/13/minecraft-plugin-channels-messaging/
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Plugin_Message
 */
interface PluginMessage {
  /** Name of the plugin channel used to send the data */
  channel: string;
  /** Any data, depending on the channel. `MC|` channels are documented [here](https://wiki.vg/Plugin_channels). */
  data: Buffer;
}
