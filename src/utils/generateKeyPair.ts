import type * as _NodeRSA from 'node-rsa';

// Lazy loading NodeRSA
let NodeRSA: typeof _NodeRSA;
// TODO: Install types for `GraalVM-Node`
declare const Java: { type: (c: string) => any };

/**
 * This function is a little bit special because there are
 * two ways to generate the keypair:
 * - On a regular NodeJS runtime it uses the `NodeRSA` library
 * - On a `GraalVM-Node` it uses the JavaVirtual machine to
 * generate the keypair using the `KeyPairGenerator` class.
 *
 * Note: To detect if the runtime is `GraalVM-Node` we use
 * the `GRAALVM_ARGUMENT_VECTOR_PROGRAM_NAME` environment
 * variable.
 * @returns The generated keypair
 */
export default async function generateKeyPair(): Promise<KeyPair> {
  if (process.env.GRAALVM_ARGUMENT_VECTOR_PROGRAM_NAME && Java) {
    const KeyPairGenerator = Java.type('java.security.KeyPairGenerator');

    const keyPairGenerator = KeyPairGenerator.getInstance('RSA');
    keyPairGenerator.initialize(1024);
    const keyPair = keyPairGenerator.generateKeyPair();

    const publicEncoded = keyPair.getPublic().getEncoded();
    const privateEncoded = keyPair.getPrivate().getEncoded();

    const Base64 = Java.type('java.util.Base64');
    const publicBase64 = Base64.getMimeEncoder().encodeToString(publicEncoded);
    const privateBase64 =
      Base64.getMimeEncoder().encodeToString(privateEncoded);

    return {
      public: `-----BEGIN PUBLIC KEY-----\n${publicBase64}\n-----END PUBLIC KEY-----`,
      private: `-----BEGIN PRIVATE KEY-----\n${privateBase64}\n-----END PRIVATE KEY-----`,
    };
  } else {
    if (!NodeRSA) NodeRSA = await import('node-rsa');

    const key = new NodeRSA({ b: 1024 });
    return {
      public: key.exportKey('pkcs8-public-pem'),
      private: key.exportKey(),
    };
  }
}

/** PEM Encoded keys */
interface KeyPair {
  public: string;
  private: string;
}
