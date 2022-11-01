import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EnchantItemPacket extends Packet<EnchantItem> {
  public static id = 0x11;
  public static state = State.PLAY;

  public write(data?: EnchantItem): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeByte(this.data.windowId);
    this.buf.plugins.mc.writeByte(this.data.enchantment);

    this.buf.finish();
  }

  public read(): EnchantItem {
    this.data = {
      windowId: this.buf.plugins.mc.readByte(),
      enchantment: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Enchant_Item
 */
interface EnchantItem {
  /** The ID of the enchantment table window sent by Open Window */
  windowId: number;
  /** The position of the enchantment on the enchantment table window, starting with 0 as the topmost one */
  enchantment: number;
}
