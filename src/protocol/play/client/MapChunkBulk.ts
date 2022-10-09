import { State } from '../../constants';
import { Packet } from '../../Packet';

export class MapChunkBulkPacket extends Packet<MapChunkBulk> {
  public static id = 0x26;
  public static state = State.PLAY;

  public write(data?: MapChunkBulk): void {
    this.data = data || this.data;

    this.buf.writeBoolean(this.data.skyLightSent);
    this.buf.writeVarInt(this.data.chunkMeta.length);
    for (const meta of this.data.chunkMeta) {
      this.buf.writeInt(meta.chunkX);
      this.buf.writeInt(meta.chunkZ);
      this.buf.plugins.mc.writeUShort(meta.primaryBitMask);
    }
    this.buf.writeBytes(this.data.chunkData);

    this.buf.finish();
  }

  public read(): MapChunkBulk {
    const skyLightSent = this.buf.readBoolean();

    const chunkMetaLength = this.buf.readVarInt();
    const chunkMeta: MapChunkBulk['chunkMeta'] = [];
    for (let i = 0; i < chunkMetaLength; i++)
      chunkMeta.push({
        chunkX: this.buf.readInt(),
        chunkZ: this.buf.readInt(),
        primaryBitMask: this.buf.plugins.mc.readUShort(),
      });

    this.data = {
      skyLightSent,
      chunkMeta,
      chunkData: this.buf.readBytes(this.buf.buffer.length - this.buf.offset),
    };

    return this.data;
  }
}

/**
 * To reduce the number of bytes, this packet is used to send chunks together for better compression results.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Map_Chunk_Bulk
 */
interface MapChunkBulk {
  skyLightSent: boolean;
  chunkMeta: {
    chunkX: number;
    chunkZ: number;
    primaryBitMask: number;
  }[];
  chunkData: Buffer; // TODO: Chunk data type
}
