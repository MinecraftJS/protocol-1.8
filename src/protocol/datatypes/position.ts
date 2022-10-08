import { BufWrapper } from '@minecraft-js/bufwrapper';
import { Position } from '../constants';

/**
 * Write a position field to the buffer
 * @param value Value to write to the buffer (position)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writePosition({ x: -80, y: 64, z: 255 });
 * ```
 */
export function writePosition(this: BufWrapper, value: Position): void {
  const buffer = Buffer.alloc(8);
  let bits = '';

  if (value.x < 0) value.x += 1 << 26;
  if (value.y < 0) value.y += 1 << 12;
  if (value.z < 0) value.z += 1 << 26;

  bits += getBinaryOfNumber(value.x, 26);
  bits += getBinaryOfNumber(value.y, 12);
  bits += getBinaryOfNumber(value.z, 26);

  buffer.write(BigInt(`0b${bits}`).toString(16), 'hex');
  this.writeToBuffer(buffer);
}

/**
 * Read a position field from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readPosition(); // { x: -80, y: 64, z: 255 }
 * ```
 */
export function readPosition(this: BufWrapper): Position {
  const raw = this.readBytes(8);
  let bits = '';
  for (const byte of raw) bits += getBinaryOfNumber(byte, 8);

  let x = parseInt(bits.slice(0, 26), 2);
  let y = parseInt(bits.slice(26, 38), 2);
  let z = parseInt(bits.slice(38, 64), 2);

  if (x >= 1 << 25) x -= 1 << 26;
  if (y >= 1 << 11) x -= 1 << 12;
  if (z >= 1 << 25) x -= 1 << 26;

  return { x, y, z };
}

function getBinaryOfNumber(num: number, outputLength: number): string {
  return ('0'.repeat(outputLength) + num.toString(2)).slice(-outputLength);
}
