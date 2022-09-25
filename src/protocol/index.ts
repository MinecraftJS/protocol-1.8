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

import { BufWrapper } from '@minecraft-js/bufwrapper';
import * as datatypes from './datatypes';
import { PacketReader } from './PacketReader';
import { PacketWriter } from './PacketWriter';

export type MinecraftBufWrapper = BufWrapper<{ mc: typeof datatypes }>;

export type ClientboundProtocol = typeof packets['clientbound'];
export type ServerboundProtocol = typeof packets['serverbound'];

export type ClientboundPacketReader = PacketReader<ClientboundProtocol>;
export type ServerboundPacketReader = PacketReader<ServerboundProtocol>;
export type ClientboundPacketWriter = PacketWriter<ClientboundProtocol>;
export type ServerboundPacketWriter = PacketWriter<ServerboundProtocol>;
