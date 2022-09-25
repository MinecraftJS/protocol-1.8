import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write an unsigned short to the buffer
 * @param value Value to write to the buffer (number)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeUShort(5);
 * ```
 */
export function writeUShort(this: BufWrapper, value: number): void {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16BE(value);
  this.writeToBuffer(buffer);
}

/**
 * Read an unsigned short from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readUShort(); // 5
 * ```
 */
export function readUShort(this: BufWrapper): number {
  const number = this.buffer.readUInt16BE(this.offset);
  this.offset += 2;
  return number;
}
