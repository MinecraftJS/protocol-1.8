import { Packet } from '../../Packet';
import { State } from '../../State';

export class EncryptionResponsePacket extends Packet<EncryptionResponse> {
  public static id = 0x01;
  public static state = State.LOGIN;

  public write(data?: EncryptionResponse): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.sharedSecret.length);
    this.buf.writeBytes(this.data.sharedSecret);

    this.buf.writeVarInt(this.data.verifyToken.length);
    this.buf.writeBytes(this.data.verifyToken);
  }

  public read(): EncryptionResponse {
    this.data = {
      sharedSecret: this.buf.readBytes(this.buf.readVarInt()),
      verifyToken: this.buf.readBytes(this.buf.readVarInt()),
    };

    return this.data;
  }
}

/**
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Encryption_Response
 */
interface EncryptionResponse {
  sharedSecret: Buffer;
  verifyToken: Buffer;
}
