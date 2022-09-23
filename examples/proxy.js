// Importing the Server and the Client from the library
const { MinecraftServer, MinecraftClient } = require('../dist');

// Creating our fake minecraft server
const server = new MinecraftServer({
  port: 8080,
});

// Listening for connections
// This excludes client pinging the server
server.on('connection', (client) => {
  // Creating our fake client that will face
  // the real minecraft server
  const fakeClient = new MinecraftClient({
    username: client.username,
    serverAddress: 'localhost',
    // No need to do our own
    // keepalive because the real
    // client is doing it for us
    disableBuiltInKeepAlive: true,
  });

  // As soon as the fake client is
  // connected redirect all the
  // packets using the `raw_data`
  // events and the `#writeRaw`
  // method
  fakeClient.on('connected', () => {
    client.on('raw_data', (data) => {
      fakeClient.writeRaw(data);
    });

    fakeClient.on('raw_data', (data) => {
      client.writeRaw(data);
    });

    // When the real client disconnects, destroy the fake client connection
    client.on('disconnected', () => fakeClient.socket.destroy());
  });
});
