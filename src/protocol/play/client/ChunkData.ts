import { State } from '../../constants';
import { Packet } from '../../Packet';

export class ChunkDataPacket extends Packet<ChunkData> {
  public static id = 0x21;
  public static state = State.PLAY;

  public write(data?: ChunkData): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.chunkX);
    this.buf.writeInt(this.data.chunkZ);
    this.buf.writeBoolean(this.data.groundUpContinuous);
    this.buf.plugins.mc.writeUShort(this.data.primaryBitMask);
    this.buf.writeVarInt(this.data.data.length);
    this.buf.writeBytes(this.data.data);

    this.buf.finish();
  }

  public read(): ChunkData {
    this.data = {
      chunkX: this.buf.readInt(),
      chunkZ: this.buf.readInt(),
      groundUpContinuous: this.buf.readBoolean(),
      primaryBitMask: this.buf.plugins.mc.readUShort(),
      data: this.buf.readBytes(this.buf.readVarInt()),
    };

    return this.data;
  }
}

/**
 * Chunks are not unloaded by the client automatically. To unload chunks,
 * send this packet with Ground-Up Continuous=true and no 16^3 chunks (eg.
 * Primary Bit Mask=0). The server does not send skylight information for
 * nether-chunks, it's up to the client to know if the player is currently
 * in the nether. You can also infer this information from the primary
 * bitmask and the amount of uncompressed bytes sent.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Chunk_Data
 */
interface ChunkData {
  chunkX: number;
  chunkZ: number;
  groundUpContinuous: boolean;
  primaryBitMask: number;
  data: Buffer; // TODO: This field should be a `Chunk`
}
