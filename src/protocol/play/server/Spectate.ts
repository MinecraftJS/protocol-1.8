import { UUID } from '@minecraft-js/uuid';
import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SpectatePacket extends Packet<Spectate> {
  public static id = 0x18;
  public static state = State.PLAY;

  public write(data?: Spectate): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.target);

    this.buf.finish();
  }

  public read(): Spectate {
    this.data = {
      target: this.buf.readUUID(),
    };

    return this.data;
  }
}

/**
 * Teleports the player to the given entity. The player must be in
 * spectator mode.
 *
 * The Notchian client only uses this to teleport to players, but it
 * appears to accept any type of entity. The entity does not need to
 * be in the same dimension as the player; if necessary, the player
 * will be respawned in the right world. If the given entity cannot
 * be found (or isn't loaded), this packet will be ignored. It will
 * also be ignored if the player attempts to teleport to themselves.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spectate
 */
interface Spectate {
  /** UUID of the player to teleport to (can also be an entity UUID) */
  target: UUID;
}
