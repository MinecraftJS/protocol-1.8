import { BufWrapper } from '@minecraft-js/bufwrapper';

/**
 * Write an identifier to the buffer
 * @param namespace Namespace used by the identifier
 * @param value Value of the identifier
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeIdentifier('minecraft', 'brand');
 * ```
 * @see https://wiki.vg/Data_types#Identifier
 */
export function writeIdentifier(
  this: BufWrapper,
  namespace: string,
  value: string
): void {
  this.writeString(`${namespace}:${value}`);
}

/**
 * Read an identifier from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readIdentifier();
 * // -> { namespace: 'minecraft', value: 'brand' }
 * ```
 * @see https://wiki.vg/Data_types#Identifier
 */
export function readIdentifier(this: BufWrapper): {
  namespace: string;
  value: string;
} {
  const raw = this.readString();
  const parsed = raw.split(':');
  return {
    namespace: parsed.shift(),
    value: parsed.join(''),
  };
}
