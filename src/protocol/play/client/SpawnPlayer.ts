import { UUID } from '@minecraft-js/uuid';
import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnPlayerPacket extends Packet<SpawnPlayer> {
  public static id = 0x0c;
  public static state = State.PLAY;

  public write(data?: SpawnPlayer): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);
    this.buf.writeUUID(this.data.playerUUID);
    this.buf.writeInt(this.data.x); // TODO: Fixed-Point number
    this.buf.writeInt(this.data.y); // TODO: Fixed-Point number
    this.buf.writeInt(this.data.z); // TODO: Fixed-Point number
    this.buf.plugins.mc.writeAngle(this.data.yaw, 'degrees');
    this.buf.plugins.mc.writeAngle(this.data.pitch, 'degrees');
    this.buf.writeShort(this.data.currentItem);
    this.buf.writeBytes(this.data.metadata);

    this.buf.finish();
  }

  public read(): SpawnPlayer {
    this.data = {
      entityId: this.buf.readVarInt(),
      playerUUID: this.buf.readUUID(),
      x: this.buf.readInt(), // TODO: Fixed-Point number
      y: this.buf.readInt(), // TODO: Fixed-Point number
      z: this.buf.readInt(), // TODO: Fixed-Point number
      yaw: this.buf.plugins.mc.readAngle('degrees'),
      pitch: this.buf.plugins.mc.readAngle('degrees'),
      currentItem: this.buf.readShort(),
      metadata: this.buf.readBytes(this.buf.buffer.length - this.buf.offset),
    };

    return this.data;
  }
}

/**
 * This packet is sent by the server when a player comes into visible
 * range, not when a player joins.
 *
 * This packet must be sent after the Player List Item (Play, 0x38,
 * clientbound) packet that adds the player data for the client to
 * use when spawning a player. If the tab list entry for the UUID
 * included in this packet is not present when this packet arrives,
 * the entity will not be spawned. The tab includes skin/cape data.
 *
 * Servers can, however, safely spawn player entities for players
 * not in visible range. The client appears to handle it correctly.
 *
 * When in online-mode the UUIDs must be valid and have valid skin
 * blobs, in offline-mode UUID v3 is used.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Player
 */
interface SpawnPlayer {
  /** Player's entity id */
  entityId: number;
  /** Player's UUID */
  playerUUID: UUID;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  /**
   * The item the player is currently holding. Note that this
   * should be 0 for “no item”, unlike -1 used in other packets.
   */
  currentItem: number;
  metadata: Buffer; // TODO: Metadata field type
}
