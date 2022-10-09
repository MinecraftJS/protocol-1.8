import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write a fixed point number to the buffer
 * @param value Value to write to the buffer (number)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeFixedPointNumber(5.9);
 * ```
 */
export function writeFixedPointNumber(this: BufWrapper, value: number): void {
  this.writeInt(value * 32);
}

/**
 * Read a fixed point number from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readFixedPointNumber(); // 5.9
 * ```
 */
export function readFixedPointNumber(this: BufWrapper): number {
  return this.readInt() / 32;
}
