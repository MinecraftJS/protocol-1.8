import { State } from '../../constants';
import { Packet } from '../../Packet';

export class ChatMessagePacket extends Packet<ChatMessage> {
  public static id = 0x02;
  public static state = State.PLAY;

  public write(data?: ChatMessage): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.message);

    this.buf.finish();
  }

  public read(): ChatMessage {
    this.data = {
      message: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * The default server will check the message to see if it begins with a `/`.
 * If it doesn't, the username of the sender is prepended and sent to all
 * other clients (including the original sender). If it does, the server
 * assumes it to be a command and attempts to process it. A message longer
 * than 100 characters will cause the server to kick the client. This change
 * was initially done by allowing the client to not slice the message up to
 * 119 (the previous limit), without changes to the server. For this reason,
 * the vanilla server kept the code to cut messages at 119, but this isn't a
 * protocol limitation and can be ignored.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Chat_Message_2
 */
interface ChatMessage {
  /** Raw input by the client */
  message: string;
}
