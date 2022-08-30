# Minecraft 1.8 Protocol

Minecraft 1.8 protocol (47)

# Benchmarks

Packet used in the benchmark: `HandshakePacket`

Computer specs: Ryzen 5 3600 - 16GB at 2100MHz

```
--- Reading benchmarks ---
Reading | Uncompressed + Unencrypted x 1,095,528 ops/sec ±1.29% (91 runs sampled)
Reading | Compressed   + Unencrypted x 1,461,069 ops/sec ±0.21% (94 runs sampled)
Reading | Compressed   + Encrypted   x 1,380,441 ops/sec ±0.80% (97 runs sampled)
Reading | Uncompressed + Encrypted   x 1,398,104 ops/sec ±0.35% (94 runs sampled)

--- Writing benchmarks ---
Writing | Uncompressed + Unencrypted x 305,641 ops/sec ±0.38% (96 runs sampled)
Writing | Compressed   + Unencrypted x 63,164 ops/sec ±1.66% (91 runs sampled)
Writing | Compressed   + Encrypted   x 55,236 ops/sec ±1.03% (89 runs sampled)
Writing | Uncompressed + Encrypted   x 207,023 ops/sec ±0.89% (93 runs sampled)
```

Run this command to run the benchmarks on your machine

```bash
$ npm run benchmark
```
