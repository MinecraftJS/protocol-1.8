const { MinecraftServer } = require('../dist');

const server = new MinecraftServer({
  port: 25565,
  compressionTreshold: 32,
});

server.on('connection', (client) => {
  console.log(`${client.username} connected!`);

  client.on('disconnected', () => {
    console.log(client.username, 'disconnected');
  });
});
