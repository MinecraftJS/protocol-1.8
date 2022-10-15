import { State, SteerVehicleFlag } from '../../constants';
import { Packet } from '../../Packet';

export class SteerVehiclePacket extends Packet<SteerVehicle> {
  public static id = 0x0c;
  public static state = State.PLAY;

  public write(data?: SteerVehicle): void {
    this.data = data || this.data;

    this.buf.writeFloat(this.data.sideways);
    this.buf.writeFloat(this.data.forward);

    let flags = 0;
    for (const flag of new Set(this.data.flags)) flags |= flag;
    this.buf.plugins.mc.writeUByte(flags);

    this.buf.finish();
  }

  public read(): SteerVehicle {
    const sideways = this.buf.readFloat();
    const forward = this.buf.readFloat();

    const rawFlags = this.buf.plugins.mc.readUByte();
    const flags: SteerVehicleFlag[] = [];
    for (const flag of Object.values(SteerVehicleFlag) as number[])
      if (rawFlags & flag) flags.push(flag);

    this.data = { sideways, forward, flags };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Steer_Vehicle
 */
interface SteerVehicle {
  sideways: number;
  forward: number;
  flags: SteerVehicleFlag[];
}
