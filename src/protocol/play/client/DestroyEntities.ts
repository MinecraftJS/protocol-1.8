import { State } from '../../constants';
import { Packet } from '../../Packet';

export class DestroyEntitiesPacket extends Packet<DestroyEntities> {
  public static id = 0x13;
  public static state = State.PLAY;

  public write(data?: DestroyEntities): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entities.length);
    for (const entity of this.data.entities) this.buf.writeVarInt(entity);

    this.buf.finish();
  }

  public read(): DestroyEntities {
    const entitiesLength = this.buf.readVarInt();
    const entities: number[] = [];

    for (let i = 0; i < entitiesLength; i++)
      entities.push(this.buf.readVarInt());

    this.data = { entities };

    return this.data;
  }
}

/**
 * The server will frequently send out a keep-alive, each containing a random ID.
 * The client must respond with the same packet. If the client does not respond to
 * them for over 30 seconds, the server kicks the client. Vice versa, if the
 * server does not send any keep-alives for 20 seconds, the client will disconnect
 * and yields a "Timed out" exception.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Destroy_Entities
 */
interface DestroyEntities {
  entities: number[];
}
