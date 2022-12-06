import {
  ComponentResolvable,
  StringComponentBuilder,
} from '@minecraft-js/chat';
import {
  ChangeGameStateGameMode,
  ChangeGameStateReason,
  ChatPosition,
  Particle,
  Position,
} from '../protocol';
import { MinecraftServerClient } from '../server/Client';

/**
 * ⚠️ This Player class is experimental
 * and not tested at all. This class is
 * meant to be used server side.
 */
export class Player {
  private _gamemode: ChangeGameStateGameMode;
  private _level: number;
  private _health: number;
  private _food: number;
  private _foodSaturation: number;

  private readonly client: MinecraftServerClient;

  public constructor(client: MinecraftServerClient) {
    this.client = client;
  }

  /**
   * Send a chat message to the player
   * @param message Message to send
   */
  public sendMessage(message: string): void;
  /**
   * Send a chat message to the player
   * @param messages Messages to send (every string in the array will be sent in different packets)
   */
  public sendMessage(messages: string[]): void;
  public sendMessage(arg1: string | string[]): void {
    if (typeof arg1 === 'string') arg1 = [arg1];

    for (const message of arg1) {
      const packet = this.client.packetWriter.write('ChatMessagePacket', {
        component: new StringComponentBuilder().setText(message).component,
        position: ChatPosition.SYSTEM_MESSAGE,
      });

      this.client.writeRaw(packet);
    }
  }

  /** The player's current gamemode */
  get gamemode() {
    return this._gamemode;
  }

  set gamemode(value: ChangeGameStateGameMode) {
    this._gamemode = value;

    const packet = this.client.packetWriter.write('ChangeGameStatePacket', {
      reason: ChangeGameStateReason.CHANGE_GAME_MODE,
      value,
    });

    this.client.writeRaw(packet);
  }

  /**
   * The player's current level.
   * Minecraft leveling system is weird
   * but the maths are done for you.
   * @example
   * ```js
   * // Set the level to 2 and the progression bar to a half
   * player.level = 2.5;
   * ```
   */
  get level() {
    return this._level;
  }

  set level(value: number) {
    this._level = value;

    let level = Math.trunc(value),
      experience = 0;
    if (value <= 16) {
      experience = Math.pow(level, 2) + 6 * level;
    } else if (value <= 31) {
      experience = 2.5 * Math.pow(level, 2) - 40.5 * level + 360;
    } else {
      experience = 4.5 * Math.pow(level, 2) - 162.5 * level + 2220;
    }

    const packet = this.client.packetWriter.write('SetExperiencePacket', {
      experienceBar: value - level,
      level,
      totalExperience: experience,
    });

    this.client.writeRaw(packet);
  }

  /** The player's health, varies from 0 to 20 (half hearts). If the value is 0 or less the player will be killed */
  get health() {
    return this._health;
  }

  set health(value: number) {
    if (value > 20) throw new Error("Health value can't be greater than 20");

    this._health = value;

    const packet = this.client.packetWriter.write('UpdateHealthPacket', {
      health: value,
      food: this.food,
      foodSaturation: this.foodSaturation,
    });

    this.client.writeRaw(packet);
  }

  /** The player's food bar */
  get food() {
    return this._food;
  }

  set food(value: number) {
    if (value > 20) throw new Error("Food value can't be greater than 20");

    this._food = value;

    const packet = this.client.packetWriter.write('UpdateHealthPacket', {
      health: this.health,
      food: value,
      foodSaturation: this.foodSaturation,
    });

    this.client.writeRaw(packet);
  }

  /** The player's saturation bar */
  get foodSaturation() {
    return this._foodSaturation;
  }

  set foodSaturation(value: number) {
    if (value > 5)
      throw new Error("Food saturation value can't be greater than 5");

    this._foodSaturation = value;

    const packet = this.client.packetWriter.write('UpdateHealthPacket', {
      health: this.health,
      food: this.food,
      foodSaturation: value,
    });

    this.client.writeRaw(packet);
  }

  /**
   * Kick the player and sends them back to the multiplayer screen.
   * `Disconnected` will be shown on the user's screen.
   */
  public kick(): void;
  /**
   * Kick the player and sends them back to the multiplayer screen
   * @param message The message that'll be displayed on the user's screen
   */
  public kick(message: string): void;
  /**
   * Kick the player and sends them back to the multiplayer screen
   * @param component The chat component that'll be displayed on the user's screen
   */
  public kick(component: ComponentResolvable): void;
  public kick(arg1?: string | ComponentResolvable): void {
    this.client.disconnect(arg1);
  }

  public displayParticle(
    particle: Particle,
    location: Position,
    data?: number[]
  ): void;
  public displayParticle(
    particle: Particle,
    location: Position,
    count: number,
    data?: number[],
    longDistance?: boolean
  ): void;
  public displayParticle(
    particle: Particle,
    location: Position,
    arg1: number[] | number,
    data?: number[],
    longDistance?: boolean
  ): void {
    if (Array.isArray(arg1)) {
      data = arg1;
      arg1 = 1; // Default value
    }

    const packet = this.client.packetWriter.write('ParticlePacket', {
      particleId: particle,
      longDistance: longDistance ?? false,
      ...location,
      offsetX: 0,
      offsetY: 0,
      offsetZ: 0,
      particleData: 0,
      particleCount: arg1,
      data: data ?? [],
    });

    this.client.writeRaw(packet);
  }

  public registerPluginChannel(channel: string): void;
  public registerPluginChannel(channels: string[]): void;
  public registerPluginChannel(arg1: string | string[]): void {
    if (typeof arg1 === 'string') arg1 = [arg1];

    const packet = this.client.packetWriter.write('PluginMessagePacket', {
      channel: 'REGISTER',
      data: Buffer.from(arg1.join('\0') + '\0'),
    });

    this.client.writeRaw(packet);
  }

  public unregisterPluginChannel(channel: string): void;
  public unregisterPluginChannel(channels: string[]): void;
  public unregisterPluginChannel(arg1: string | string[]): void {
    if (typeof arg1 === 'string') arg1 = [arg1];

    const packet = this.client.packetWriter.write('PluginMessagePacket', {
      channel: 'UNREGISTER',
      data: Buffer.from(arg1.join('\0') + '\0'),
    });

    this.client.writeRaw(packet);
  }

  public sendPluginMessage(channel: string, message: Buffer): void {
    const packet = this.client.packetWriter.write('PluginMessagePacket', {
      channel,
      data: message,
    });

    this.client.writeRaw(packet);
  }
}
