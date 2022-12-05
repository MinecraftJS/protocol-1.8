import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SoudEffectPacket extends Packet<SoudEffect> {
  public static id = 0x29;
  public static state = State.PLAY;

  public write(data?: SoudEffect): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.soundName);
    this.buf.writeInt(this.data.effectPositionX * 8);
    this.buf.writeInt(this.data.effectPositionY * 8);
    this.buf.writeInt(this.data.effectPositionZ * 8);
    this.buf.writeFloat(this.data.volume);
    this.buf.plugins.mc.writeUByte(this.data.pitch);

    this.buf.finish();
  }

  public read(): SoudEffect {
    this.data = {
      soundName: this.buf.readString(),
      effectPositionX: this.buf.readInt() / 8,
      effectPositionY: this.buf.readInt() / 8,
      effectPositionZ: this.buf.readInt() / 8,
      volume: this.buf.readFloat(),
      pitch: this.buf.plugins.mc.readUByte(),
    };

    return this.data;
  }
}

/**
 * Used to play a sound effect on the client.
 * Custom sounds may be added by resource packs.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Sound_Effect
 */
interface SoudEffect {
  /** All known sound effect names can be seen [here](https://github.com/SirCmpwn/Craft.Net/blob/master/source/Craft.Net.Common/SoundEffect.cs) */
  soundName: string;
  /** No need to manually multiply the value */
  effectPositionX: number;
  /** No need to manually multiply the value */
  effectPositionY: number;
  /** No need to manually multiply the value */
  effectPositionZ: number;
  /** 1 is 100%, can be more */
  volume: number;
  /** 63 is 100%, can be more */
  pitch: number;
}
