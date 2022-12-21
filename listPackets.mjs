import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const BASE_PATH = (state) => join('src', 'protocol', state);
const states = ['handshaking', 'login', 'play', 'status'];

async function list(boundTo) {
  console.log(
    `--- ${boundTo === 'client' ? 'Clientbound' : 'Serverbound'} Packets ---`
  );

  for (const state of states) {
    const path = join(BASE_PATH(state), boundTo);

    const dirStat = await stat(path).catch(() => false);
    if (!dirStat || !dirStat.isDirectory()) continue;

    const files = await readdir(path);
    const packets = (
      await Promise.all(
        files
          .filter((file) => file !== 'index.ts')
          .map(async (file) => {
            const content = await readFile(join(path, file));

            return {
              name: /class .* extends/g
                .exec(content)[0]
                .replace(/class | extends/g, ''),
              id: /static id = .*;/g
                .exec(content)[0]
                .replace(/static id = |;/g, ''),
            };
          })
      )
    ).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

    console.log(` - State: ${state}`);
    for (const packet of packets) {
      console.log(`  ${packet.id} - ${packet.name}`);
    }
    console.log('');
  }
}

await list('client');
console.log('');
await list('server');
