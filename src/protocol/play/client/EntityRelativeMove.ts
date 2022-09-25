import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityRelativeMovePacket extends Packet<EntityRelativeMove> {
  public static id = 0x15;
  public static state = State.PLAY;

  public write(data?: EntityRelativeMove): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.plugins.mc.writeByte(this.data.deltaX);
    this.buf.plugins.mc.writeByte(this.data.deltaY);
    this.buf.plugins.mc.writeByte(this.data.deltaZ);
    this.buf.writeBoolean(this.data.onGround);

    this.buf.finish();
  }

  public read(): EntityRelativeMove {
    this.data = {
      entityId: this.buf.readVarInt(),
      deltaX: this.buf.plugins.mc.readByte(),
      deltaY: this.buf.plugins.mc.readByte(),
      deltaZ: this.buf.plugins.mc.readByte(),
      onGround: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * This packet is sent by the server when an entity moves less
 * then 4 blocks; if an entity moves more than 4 blocks Entity
 * Teleport should be sent instead. This packet allows at most
 * four blocks movement in any direction, because byte range
 * is from -128 to 127.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Relative_Move
 */
interface EntityRelativeMove {
  entityId: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  onGround: boolean;
}
