import {
  ClientboundPacketReader,
  ClientboundPacketWriter,
  PacketReader,
  packets,
  PacketWriter,
} from '../protocol';

export function isClientboundPacketReader(
  value: PacketReader<any>
): value is ClientboundPacketReader {
  return value.protocol === packets.clientbound;
}

export function isClientboundPacketWriter(
  value: PacketWriter<any>
): value is ClientboundPacketWriter {
  return value.protocol === packets.clientbound;
}
