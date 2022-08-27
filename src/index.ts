import * as handshakingSB from './handshaking/server';
import * as loginCB from './login/client';
import * as loginSB from './login/server';

export * from './Packet';
export * from './State';

export const packets = {
  clientbound: {
    ...loginCB,
  },
  serverbound: {
    ...handshakingSB,
    ...loginSB,
  },
};
