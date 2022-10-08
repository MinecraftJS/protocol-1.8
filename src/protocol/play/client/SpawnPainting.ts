import { PaintingDirection, Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnPaintingPacket extends Packet<SpawnPainting> {
  public static id = 0x10;
  public static state = State.PLAY;

  public write(data?: SpawnPainting): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.writeString(this.data.title);
    this.buf.plugins.mc.writePosition(this.data.location);
    this.buf.plugins.mc.writeUByte(this.data.direction);

    this.buf.finish();
  }

  public read(): SpawnPainting {
    this.data = {
      entityId: this.buf.readVarInt(),
      title: this.buf.readString(),
      location: this.buf.plugins.mc.readPosition(),
      direction: this.buf.plugins.mc.readUByte(),
    };

    return this.data;
  }
}

/**
 * This packet shows location, name, and type of painting.
 * Calculating the center of an image: given a (width x height)
 * grid of cells, with (0, 0) being the top left corner, the
 * center is (max(0, width / 2 - 1), height / 2). E.g.
 * ```txt
 * 2x1 (1, 0)
 * 4x4 (1, 2)
 * ```
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Painting
 */
interface SpawnPainting {
  entityId: number;
  /** Name of the painting. Max length 13 */
  title: string;
  /** Center coordinates */
  location: Position;
  /** Direction the painting faces */
  direction: PaintingDirection;
}
