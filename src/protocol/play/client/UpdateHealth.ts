import { State } from '../../constants';
import { Packet } from '../../Packet';

export class UpdateHealthPacket extends Packet<UpdateHealth> {
  public static id = 0x06;
  public static state = State.PLAY;

  public write(data?: UpdateHealth): void {
    this.data = data || this.data;

    this.buf.writeFloat(this.data.health);
    this.buf.writeVarInt(this.data.food);
    this.buf.writeFloat(this.data.foodSaturation);

    this.buf.finish();
  }

  public read(): UpdateHealth {
    this.data = {
      health: this.buf.readFloat(),
      food: this.buf.readVarInt(),
      foodSaturation: this.buf.readFloat(),
    };

    return this.data;
  }
}

/**
 * Sent by the server to update/set the health of the player it is sent to.
 * Food saturation acts as a food “overcharge”. Food values will not decrease
 * ewhile the saturation is over zero. Players logging in automatically get
 * a saturation of 5.0. Eating food increases the saturation as well as the food bar.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Update_Health
 */
interface UpdateHealth {
  /** 0 or less = dead, 20 = full HP */
  health: number;
  /** 0 - 20 */
  food: number;
  /** Seems to vary from 0.0 to 5.0 in integer increments */
  foodSaturation: number;
}
