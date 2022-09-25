import { BufWrapper } from '@minecraft-js/bufwrapper';
import { ComponentResolvable } from '@minecraft-js/chat';

/**
 * Write a chat field to the buffer
 * @param value Value to write to the buffer (Chat Component)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeByte(chatComponent);
 * ```
 */
export function writeChat(this: BufWrapper, chat: ComponentResolvable): void {
  this.writeString(JSON.stringify(chat));
}

/**
 * Read a chat field from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readChat(); // A chat component
 * ```
 */
export function readChat(this: BufWrapper): ComponentResolvable {
  return JSON.parse(this.readString());
}
