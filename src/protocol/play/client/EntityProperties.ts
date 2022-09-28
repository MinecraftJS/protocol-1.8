import { UUID } from '@minecraft-js/uuid';
import { ModifierOperation, State } from '../../constants';
import { Packet } from '../../Packet';

export class EntityPropertiesPacket extends Packet<EntityProperties> {
  public static id = 0x20;
  public static state = State.PLAY;

  public write(data?: EntityProperties): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.entityId);

    const properties = Object.keys(this.data.properties);
    this.buf.writeInt(properties.length);
    for (const propertyName of properties) {
      const property = this.data.properties[propertyName];
      this.buf.writeString(propertyName);
      this.buf.writeDouble(property.value);

      this.buf.writeVarInt(property.modifiers.length);
      for (const modifier of property.modifiers) {
        this.buf.writeUUID(modifier.UUID);
        this.buf.writeDouble(modifier.amount);
        this.buf.plugins.mc.writeByte(modifier.operation);
      }
    }

    this.buf.finish();
  }

  public read(): EntityProperties {
    const entityId = this.buf.readVarInt();

    const propertiesLength = this.buf.readInt();
    const properties: Properties = {};
    for (let i = 0; i < propertiesLength; i++) {
      const key = this.buf.readString();
      const value = this.buf.readDouble();

      const modifiersLength = this.buf.readVarInt();
      const modifiers: Modifier[] = [];
      for (let i = 0; i < modifiersLength; i++) {
        modifiers.push({
          UUID: this.buf.readUUID(),
          amount: this.buf.readDouble(),
          operation: this.buf.plugins.mc.readByte(),
        });
      }

      properties[key] = { value, modifiers };
    }

    this.data = { entityId, properties };

    return this.data;
  }
}

/**
 * Sets attributes on the given entity.
 * @see https://wiki.vg/index.php?title=Protocol&oldid=7368#Entity_Properties
 */
interface EntityProperties {
  entityId: number;
  properties: Properties;
}

interface Modifier {
  UUID: UUID;
  amount: number;
  operation: ModifierOperation;
}

interface Property {
  value: number;
  modifiers: Modifier[];
}

interface Properties {
  [key: string]: Property;
}
