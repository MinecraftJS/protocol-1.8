import { Packet } from '../../Packet';
import { State } from '../../State';

export class SetCompressionPacket extends Packet<SetCompression> {
  public static id = 0x03;
  public static state = State.LOGIN;

  public write(data?: SetCompression): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.threshold);

    this.buf.finish();
  }

  public read(): SetCompression {
    this.data = {
      threshold: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Set_Compression_2
 */
interface SetCompression {
  /** Maximum size of a packet before its compressed */
  threshold: number;
}
