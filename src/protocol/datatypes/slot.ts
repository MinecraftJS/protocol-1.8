import { BufWrapper } from '@minecraft-js/bufwrapper';
import { parseNBT, writeNBT } from '@minecraft-js/nbt';
import { Slot } from '../constants';

/**
 * Write a slot field to the buffer
 * @param value Value to write to the buffer (field)
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.writeSlot({ ... });
 * ```
 */
export function writeSlot(this: BufWrapper, value: Slot): void {
  this.writeShort(value.blockId);
  if (value.blockId === -1) return;

  const buffer = Buffer.alloc(2);
  buffer.writeInt8(value.itemCount);
  buffer.writeInt16BE(value.itemDamage);
  this.writeToBuffer(buffer);

  let nbt = Buffer.alloc(1);
  if (value.nbt) nbt = writeNBT(value.nbt);
  this.writeToBuffer(nbt);
}

/**
 * Read a slot field from the buffer
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *  plugins: { mc }
 * });
 *
 * buf.plugins.mc.readSlot(); // { ... }
 * ```
 */
export function readSlot(this: BufWrapper): Slot {
  const slot: Slot = { blockId: -1 };
  slot.blockId = this.readShort();
  if (slot.blockId === -1) return slot;

  slot.itemCount = this.buffer.readInt8(this.offset++);
  slot.itemDamage = this.readShort();

  if (this.buffer.readUint8(this.offset) === 0) return slot;
  slot.nbt = parseNBT(this.buffer);

  // TODO: Update the offset correctly
  const length = writeNBT(slot.nbt).length;
  this.offset += length;

  return slot;
}
