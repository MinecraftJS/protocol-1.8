import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class BlockChangePacket extends Packet<BlockChange> {
  public static id = 0x23;
  public static state = State.PLAY;

  public write(data?: BlockChange): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.writeVarInt(this.data.blockId);

    this.buf.finish();
  }

  public read(): BlockChange {
    this.data = {
      location: this.buf.plugins.mc.readPosition(),
      blockId: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * Fired whenever a block is changed within the render distance.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Block_Change
 */
interface BlockChange {
  /** Block Coordinates */
  location: Position;
  /** The new block state ID for the block as given in the global palette */
  blockId: number;
}
