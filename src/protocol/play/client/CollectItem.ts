import { State } from '../../constants';
import { Packet } from '../../Packet';

export class CollectItemPacket extends Packet<CollectItem> {
  public static id = 0x0d;
  public static state = State.PLAY;

  public write(data?: CollectItem): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.collectedEntityId);
    this.buf.writeVarInt(this.data.collectorEntityId);

    this.buf.finish();
  }

  public read(): CollectItem {
    this.data = {
      collectedEntityId: this.buf.readVarInt(),
      collectorEntityId: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * Sent by the server when someone picks up an item lying on the ground — its sole
 * purpose appears to be the animation of the item flying towards you. It doesn't
 * destroy the entity in the client memory, and it doesn't add it to your inventory.
 * The server only checks for items to be picked up after each Player Position
 * (and Player Position And Look) packet sent by the client.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Collect_Item
 */
interface CollectItem {
  collectedEntityId: number;
  collectorEntityId: number;
}
