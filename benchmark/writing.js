const { PacketWriter, packets } = require('../dist');
const Benchmark = require('benchmark');
const { randomBytes } = require('node:crypto');

const sharedToken = randomBytes(16);
const packetWriter = new PacketWriter(packets.serverbound);

const uncompressedW = new Benchmark.Suite();
uncompressedW
  .add('Writing | Uncompressed + Unencrypted', () => {
    packetWriter.write('HandshakePacket', {
      protocolVersion: 47,
      serverAddress: 'localhost',
      serverPort: 25565,
      nextState: 2,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setCompression(true, 0);

const compressedW = new Benchmark.Suite();
compressedW
  .add('Writing | Compressed   + Unencrypted', () => {
    packetWriter.write('HandshakePacket', {
      protocolVersion: 47,
      serverAddress: 'localhost',
      serverPort: 25565,
      nextState: 2,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setEncryption(true, sharedToken);

const encryptedCompressedW = new Benchmark.Suite();
encryptedCompressedW
  .add('Writing | Compressed   + Encrypted  ', () => {
    packetWriter.write('HandshakePacket', {
      protocolVersion: 47,
      serverAddress: 'localhost',
      serverPort: 25565,
      nextState: 2,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setCompression(false);

const encryptedUncompressedW = new Benchmark.Suite();
encryptedUncompressedW
  .add('Writing | Uncompressed + Encrypted  ', () => {
    packetWriter.write('HandshakePacket', {
      protocolVersion: 47,
      serverAddress: 'localhost',
      serverPort: 25565,
      nextState: 2,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
