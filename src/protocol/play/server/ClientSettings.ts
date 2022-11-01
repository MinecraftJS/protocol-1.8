import { ChatMode, SkinPart, State } from '../../constants';
import { Packet } from '../../Packet';

export class ClientSettingsPacket extends Packet<ClientSettings> {
  public static id = 0x15;
  public static state = State.PLAY;

  public write(data?: ClientSettings): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.locale);
    this.buf.plugins.mc.writeByte(this.data.viewDistance);
    this.buf.plugins.mc.writeByte(this.data.chatMode);
    this.buf.writeBoolean(this.data.chatColors);

    let flags = 0;
    for (const flag of new Set(this.data.displayedSkinParts)) flags |= flag;
    this.buf.plugins.mc.writeUByte(flags);

    this.buf.finish();
  }

  public read(): ClientSettings {
    const locale = this.buf.readString();
    const viewDistance = this.buf.plugins.mc.readByte();
    const chatMode = this.buf.plugins.mc.readByte();
    const chatColors = this.buf.readBoolean();

    const rawFlags = this.buf.plugins.mc.readUByte();
    const displayedSkinParts: SkinPart[] = [];
    for (const flag of Object.values(SkinPart) as number[])
      if (rawFlags & flag) displayedSkinParts.push(flag);

    this.data = {
      locale,
      viewDistance,
      chatMode,
      chatColors,
      displayedSkinParts,
    };

    return this.data;
  }
}

/**
 * Sent when the player connects, or when settings are changed.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Client_Settings
 */
interface ClientSettings {
  locale: string;
  viewDistance: number;
  chatMode: ChatMode;
  chatColors: boolean;
  displayedSkinParts: SkinPart[];
}
