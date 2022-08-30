import { State } from '../../constants';
import { Packet } from '../../Packet';

export class TimeUpdatePacket extends Packet<TimeUpdate> {
  public static id = 0x03;
  public static state = State.PLAY;

  public write(data?: TimeUpdate): void {
    this.data = data || this.data;

    this.buf.writeLong(this.data.worldAge);
    this.buf.writeLong(this.data.timeOfDay);

    this.buf.finish();
  }

  public read(): TimeUpdate {
    this.data = {
      worldAge: this.buf.readLong(),
      timeOfDay: this.buf.readLong(),
    };

    return this.data;
  }
}

/**
 * Time is based on ticks, where 20 ticks happen every second. There are 24000 ticks in a day, making Minecraft days exactly 20 minutes long.
 * The time of day is based on the timestamp modulo 24000. 0 is sunrise, 6000 is noon, 12000 is sunset, and 18000 is midnight.
 * The default SMP server increments the time by `20` every second.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Time_Update
 */
interface TimeUpdate {
  /** In ticks; not changed by server commands */
  worldAge: number;
  /** The world (or region) time, in ticks. If negative the sun will stop moving at the Math.abs of the time */
  timeOfDay: number;
}
