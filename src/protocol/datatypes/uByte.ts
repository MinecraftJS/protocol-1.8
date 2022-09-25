import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write an unsigned byte to the buffer
 * @param value Value to write to the buffer (number)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeUByte(5);
 * ```
 */
export function writeUByte(this: BufWrapper, value: number): void {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(value);
  this.writeToBuffer(buffer);
}

/**
 * Read an unsigned byte from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readUByte(); // 5
 * ```
 */
export function readUByte(this: BufWrapper): number {
  const number = this.buffer.readUInt8(this.offset);
  this.offset += 1;
  return number;
}
