const { MinecraftClient } = require('../dist');

const client = new MinecraftClient({
  username: 'Cy0ze',
  serverAddress: 'localhost',
});

client.on('connected', () => {
  console.log(client.username, 'connected!');
});
