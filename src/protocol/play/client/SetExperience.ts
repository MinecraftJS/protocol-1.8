import { State } from '../../constants';
import { Packet } from '../../Packet';

export class SetExperiencePacket extends Packet<SetExperience> {
  public static id = 0x1f;
  public static state = State.PLAY;

  public write(data?: SetExperience): void {
    this.data = data || this.data;

    this.buf.writeFloat(this.data.experienceBar);
    this.buf.writeVarInt(this.data.level);
    this.buf.writeVarInt(this.data.totalExperience);

    this.buf.finish();
  }

  public read(): SetExperience {
    this.data = {
      experienceBar: this.buf.readFloat(),
      level: this.buf.readVarInt(),
      totalExperience: this.buf.readVarInt(),
    };

    return this.data;
  }
}

/**
 * Sent by the server when the client should change experience levels.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Set_Experience
 */
interface SetExperience {
  experienceBar: number;
  level: number;
  totalExperience: number;
}
