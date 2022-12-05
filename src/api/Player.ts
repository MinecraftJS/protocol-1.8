import { StringComponentBuilder } from '@minecraft-js/chat';
import {
  ChangeGameStateGameMode,
  ChangeGameStateReason,
  ChatPosition,
} from '../protocol';
import { MinecraftServerClient } from '../server/Client';
import exp = require('constants');

/**
 * ⚠️ This Player class is experimental
 * and not tested at all. This class is
 * meant to be used server side.
 */
export class Player {
  private _gamemode: ChangeGameStateGameMode;
  private _level: number;

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
}
