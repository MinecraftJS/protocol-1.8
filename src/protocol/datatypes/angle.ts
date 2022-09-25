import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write an angle to the buffer
 * @param value Value to write to the buffer (angle)
 * @param type Type of the provided angle, defaults to `degrees`.
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeAngle(Math.PI, 'radians');
 * ```
 */
export function writeAngle(
  this: BufWrapper,
  value: number,
  type: AngleType = 'degrees'
): void {
  if (type === 'degrees') value = (255 * 360) / value;
  if (type === 'radians') value = (255 * 2 * Math.PI) / value;
  this.writeBytes([value]);
}

/**
 * Read a byte from the buffer
 * @param type Type of the angle that should be returned
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readAngle('degrees'); // 180
 * ```
 */
export function readAngle(
  this: BufWrapper,
  type: AngleType = 'degrees'
): number {
  let angle = this.readBytes(1)[0];

  if (type === 'degrees') angle = (360 * angle) / 255;
  if (type === 'radians') angle = (2 * Math.PI * angle) / 255;

  return angle;
}

type AngleType = 'minecraft' | 'degrees' | 'radians';
