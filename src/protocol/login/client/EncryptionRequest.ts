import { State } from '../../constants';
import { Packet } from '../../Packet';

export class EncryptionRequestPacket extends Packet<EncryptionRequest> {
  public static id = 0x01;
  public static state = State.LOGIN;

  public write(data?: EncryptionRequest): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.serverId);

    this.buf.writeVarInt(this.data.publicKey.length);
    this.buf.writeBytes(this.data.publicKey);

    this.buf.writeVarInt(this.data.verifyToken.length);
    this.buf.writeBytes(this.data.verifyToken);

    this.buf.finish();
  }

  public read(): EncryptionRequest {
    this.data = {
      serverId: this.buf.readString(),
      publicKey: this.buf.readBytes(this.buf.readVarInt()),
      verifyToken: this.buf.readBytes(this.buf.readVarInt()),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Encryption_Request
 */
interface EncryptionRequest {
  /** Appears to be empty */
  serverId: string;
  publicKey: Buffer;
  verifyToken: Buffer;
}
