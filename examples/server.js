const { MinecraftServer } = require('../dist');

const port = 25565;

const server = new MinecraftServer({
  port,
  compressionTreshold: 32,
  onlineMode: true,
});

server.on('listening', () => {
  console.log('Server listening on port', port);
});

server.on('connection', (client) => {
  console.log(`${client.username} connected!`);
  console.log(client);

  client.on('disconnected', () => {
    console.log(client.username, 'disconnected');
  });
});
