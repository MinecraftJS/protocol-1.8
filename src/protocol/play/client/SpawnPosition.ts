import { Position, State } from '../../constants';
import { Packet } from '../../Packet';

export class SpawnPositionPacket extends Packet<SpawnPosition> {
  public static id = 0x05;
  public static state = State.PLAY;

  public write(data?: SpawnPosition): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writePosition(this.data.location);

    this.buf.finish();
  }

  public read(): SpawnPosition {
    this.data = {
      location: this.buf.plugins.mc.readPosition(),
    };

    return this.data;
  }
}

/**
 * Sent by the server after login to specify the coordinates of
 * the spawn point (the point at which players spawn at, and
 * which the compass points to). It can be sent at any time
 * to update the point compasses point at.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Spawn_Position
 */
interface SpawnPosition {
  location: Position;
}
