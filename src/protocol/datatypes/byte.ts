import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write a byte to the buffer
 * @param value Value to write to the buffer (number)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeByte(5);
 * ```
 */
export function writeByte(this: BufWrapper, value: number): void {
  const buffer = Buffer.alloc(1);
  buffer.writeInt8(value);
  this.writeToBuffer(buffer);
}

/**
 * Read a byte from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readByte(); // 5
 * ```
 */
export function readByte(this: BufWrapper): number {
  const number = this.buffer.readInt8(this.offset);
  this.offset += 1;
  return number;
}
