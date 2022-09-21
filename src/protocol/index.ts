import { Packet } from './Packet';

export type ProtocolResolvable = { [key: string]: typeof Packet<any> };

import * as handshakingSB from './handshaking/server';
import * as loginCB from './login/client';
import * as loginSB from './login/server';
import * as playCB from './play/client';
import * as playSB from './play/server';
import * as statusCB from './status/client';
import * as statusSB from './status/server';

export const packets = {
  clientbound: {
    ...loginCB,
    ...playCB,
    ...statusCB,
  },
  serverbound: {
    ...handshakingSB,
    ...loginSB,
    ...playSB,
    ...statusSB,
  },
};

export * from './constants';
export * from './Packet';
export * from './PacketReader';
export * from './PacketWriter';

import { PacketReader } from './PacketReader';
import { PacketWriter } from './PacketWriter';

export type ClientboundPacketReader = PacketReader<
  typeof packets['clientbound']
>;
export type ServerboundPacketReader = PacketReader<
  typeof packets['serverbound']
>;
export type ClientboundPacketWriter = PacketWriter<
  typeof packets['clientbound']
>;
export type ServerboundPacketWriter = PacketWriter<
  typeof packets['serverbound']
>;
