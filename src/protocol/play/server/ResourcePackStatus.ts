import {
  ResourcePackStatus as ResourcePackStatusEnum,
  State,
} from '../../constants';
import { Packet } from '../../Packet';

export class ResourcePackStatusPacket extends Packet<ResourcePackStatus> {
  public static id = 0x19;
  public static state = State.PLAY;

  public write(data?: ResourcePackStatus): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.hash);
    this.buf.writeVarInt(this.data.result);

    this.buf.finish();
  }

  public read(): ResourcePackStatus {
    this.data = {
      hash: this.buf.readString(),
      result: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Resource_Pack_Status
 */
interface ResourcePackStatus {
  /** The hash sent in the ResourcePackSend packet. */
  hash: string;
  /** `0`: successfully loaded, `1`: declined, `2`: failed download, `3`: accepted */
  result: ResourcePackStatusEnum;
}
