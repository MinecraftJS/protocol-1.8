import { parseUUID, UUID } from '@minecraft-js/uuid';
import { State } from '../../constants';
import { Packet } from '../../Packet';

export class ResponsePacket extends Packet<Response> {
  public static id = 0x00;
  public static state = State.STATUS;

  public write(data?: Response): void {
    this.data = data || this.data;

    this.buf.writeString(JSON.stringify(this.data));

    this.buf.finish();
  }

  public read(): Response {
    const parsed: Response = JSON.parse(this.buf.readString());

    // Converting string UUIDs into UUID instances
    if (parsed.players?.sample)
      parsed.players.sample = parsed.players.sample.map((player) => ({
        name: player.name,
        id: parseUUID(player.id.toString()),
      }));

    this.data = parsed;

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Response
 */
interface Response {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample: {
      name: string;
      /** An id of a sample needs to be a valid UUID format, else the connection will abort. */
      id: UUID;
    }[];
  };
  /**
   * The description field is a Chat object. Note that the Notchian
   * server has no way of providing actual chat component data; instead
   * section sign-based codes are embedded within the text of the object.
   * However, third-party servers such as Spigot and Paper will return
   * full components, so make sure you can handle both.
   */
  description: {
    // TODO: Parse Chat component
    [key: string]: string | boolean;
  };
  /**
   * The favicon field is optional. The sample field may be missing if the server has no online players.
   *
   * The favicon should be a PNG image that is Base64 encoded (without newlines: `\n`, new lines no longer
   * work since 1.13) and prepended with `data:image/png;base64,`. It should also be noted that the source
   * image must be exactly 64x64 pixels, otherwise the Notchian client will not render the image.
   */
  favicon?: string;
  /**
   * When the previewsChat field is set to `true`, the client will display a warning upon joining and send
   * Chat Preview (serverbound) packets while the player types chat messages. This field is optional,
   * although the Notchian server will always include it.
   */
  previewsChat?: boolean;
  enforcesSecureChat?: boolean;
}
