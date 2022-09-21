/**
 * Parse a public key from a buffer
 * @param buffer The buffer containing the key
 * @returns The key in a PEM format as a string
 */
export function parsePublicKey(buffer: Buffer): string {
  const arr = buffer.toString('base64').split('');

  for (let i = 0; i < arr.length; i++) if (i % 65 === 0) arr.splice(i, 0, '\n');

  return (
    '-----BEGIN PUBLIC KEY-----' + arr.join('') + '\n-----END PUBLIC KEY-----\n'
  );
}
