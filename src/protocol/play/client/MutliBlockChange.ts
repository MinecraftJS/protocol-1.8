import { State } from '../../constants';
import { Packet } from '../../Packet';

export class MutliBlockChangePacket extends Packet<MutliBlockChange> {
  public static id = 0x22;
  public static state = State.PLAY;

  public write(data?: MutliBlockChange): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.chunkX);
    this.buf.writeInt(this.data.chunkY);

    this.buf.writeVarInt(this.data.records.length);
    for (const record of this.data.records) {
      this.buf.plugins.mc.writeUByte(
        (record.horizontalPosition.x << 4) | record.horizontalPosition.z
      );
      this.buf.plugins.mc.writeUByte(record.yCoordinate);
      this.buf.writeVarInt(record.blockId);
    }

    this.buf.finish();
  }

  public read(): MutliBlockChange {
    const chunkX = this.buf.readInt();
    const chunkY = this.buf.readInt();

    const recordsLength = this.buf.readVarInt();
    const records: MutliBlockChange['records'] = [];
    for (let i = 0; i < recordsLength; i++) {
      const horizontalPosition = this.buf.plugins.mc.readUByte();
      const x = horizontalPosition >> 4;
      const z = horizontalPosition & 0x0f;

      records.push({
        horizontalPosition: { x, z },
        yCoordinate: this.buf.plugins.mc.readUByte(),
        blockId: this.buf.readVarInt(),
      });
    }

    this.data = { chunkX, chunkY, records };

    return this.data;
  }
}

/**
 * Fired whenever 2 or more blocks are changed within the render distance
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Multi_Block_Change
 */
interface MutliBlockChange {
  chunkX: number;
  chunkY: number;
  records: {
    horizontalPosition: {
      x: number;
      z: number;
    };
    yCoordinate: number;
    blockId: number;
  }[];
}
