import { PlayerAbilityFlag, State } from '../../constants';
import { Packet } from '../../Packet';

export class PlayerAbilitiesPacket extends Packet<PlayerAbilities> {
  public static id = 0x13;
  public static state = State.PLAY;

  public write(data?: PlayerAbilities): void {
    this.data = data || this.data;

    let flags = 0;
    for (const flag of new Set(this.data.flags)) flags |= flag;
    this.buf.plugins.mc.writeUByte(flags);

    this.buf.writeFloat(this.data.flyingSpeed);
    this.buf.writeFloat(this.data.walkingSpeed);

    this.buf.finish();
  }

  public read(): PlayerAbilities {
    const rawFlags = this.buf.plugins.mc.readUByte();
    const flags: PlayerAbilityFlag[] = [];
    for (const flag of Object.values(PlayerAbilityFlag) as number[])
      if (rawFlags & flag) flags.push(flag);

    const flyingSpeed = this.buf.readFloat();
    const walkingSpeed = this.buf.readFloat();

    this.data = { flags, flyingSpeed, walkingSpeed };

    return this.data;
  }
}

/**
 * The latter 2 bytes are used to indicate the walking and flying speeds respectively,
 * while the first byte is used to determine the value of 4 booleans.
 *
 * The vanilla client sends this packet when the player starts/stops flying with the
 * Flags parameter changed accordingly. All other parameters are ignored by the
 * vanilla server.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Player_Abilities_2
 */
interface PlayerAbilities {
  flags: PlayerAbilityFlag[];
  flyingSpeed: number;
  walkingSpeed: number;
}
