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
