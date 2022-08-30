const { PacketWriter, PacketReader, packets } = require('../dist');
const Benchmark = require('benchmark');
const { randomBytes } = require('node:crypto');

const sharedToken = randomBytes(16);
const packetWriter = new PacketWriter(packets.serverbound);
const packetReader = new PacketReader(packets.serverbound, {
  disablePacketEffectProcessing: true,
});

function getPacket() {
  return packetWriter.write('HandshakePacket', {
    protocolVersion: 47,
    serverAddress: 'localhost',
    serverPort: 8080,
    nextState: 2,
  });
}

const uncompressedPacket = getPacket();

const uncompressedR = new Benchmark.Suite();
uncompressedR
  .add('Reading | Uncompressed + Unencrypted', () => {
    packetReader.read(uncompressedPacket);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setCompression(true, 0);
const compressedPacket = getPacket();

const compressedR = new Benchmark.Suite();
compressedR
  .add('Reading | Compressed   + Unencrypted', () => {
    packetReader.read(compressedPacket);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setEncryption(true, sharedToken);
packetReader.setEncryption(true, sharedToken);
const encryptedPacket = getPacket();

const encryptedR = new Benchmark.Suite();
encryptedR
  .add('Reading | Compressed   + Encrypted  ', () => {
    packetReader.read(encryptedPacket);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

packetWriter.setCompression(false);
packetReader.setCompression(false);
const encryptedUncompressedPacket = getPacket();

const encryptedUncompressedR = new Benchmark.Suite();
encryptedUncompressedR
  .add('Reading | Uncompressed + Encrypted  ', () => {
    packetReader.read(encryptedUncompressedPacket);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
