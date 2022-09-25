import { ComponentResolvable } from '@minecraft-js/chat';
import { ChatPosition, State } from '../../constants';
import { Packet } from '../../Packet';

export class ChatMessagePacket extends Packet<ChatMessage> {
  public static id = 0x02;
  public static state = State.PLAY;

  public write(data?: ChatMessage): void {
    this.data = data || this.data;

    this.buf.plugins.mc.writeChat(this.data.component);
    this.buf.writeBytes([this.data.position]);

    this.buf.finish();
  }

  public read(): ChatMessage {
    this.data = {
      component: this.buf.plugins.mc.readChat(),
      position: this.buf.plugins.mc.readByte(),
    };

    return this.data;
  }
}

/**
 * Identifying the difference between Chat/System Message is important as it helps respect the user's
 * chat visibility options. While Position 2 accepts json formatting it will not display, old style
 * formatting works
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Chat_Message
 */
interface ChatMessage {
  /** Chat component to send to the client */
  component: ComponentResolvable;
  /** Position of the message, wherever it should be displayed */
  position: ChatPosition;
}
