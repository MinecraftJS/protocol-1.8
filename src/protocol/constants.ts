/**
 * Enumeration of all the states the client could be in
 */
export enum State {
  HANDSHAKING = 0,
  STATUS = 1,
  LOGIN = 2,
  PLAY = 3,
}

/**
 * Enumeration of all the different gamemodes
 *
 * Used in the following packets:
 * - JoinGamePacket
 */
export enum GameMode {
  SURVIVAL = 0x00,
  CREATIVE = 0x01,
  ADVENTURE = 0x02,
  SPECTATOR = 0x03,
  HARDCORE_SURVIVAL = 0x04,
  HARDCORE_CREATIVE = 0x05,
  HARDCORE_ADVENTURE = 0x06,
  HARDCORE_SPECTATOR = 0x07,
}

/**
 * Enumeration of all the different dimensions
 *
 * Used in the following packets:
 * - JoinGamePacket
 */
export enum Dimension {
  NETHER = -1,
  OVERWORLD = 0,
  END = 1,
}

/**
 * Enumeration of all the different difficulties
 *
 * Used in the following packets:
 * - JoinGamePacket
 */
export enum Difficulty {
  PEACEFUL = 0,
  EASY = 1,
  NORMAL = 2,
  HARD = 3,
}

/**
 * Enumeration of all the different level types
 *
 * Used in the following packets:
 * - JoinGamePacket
 */
export enum LevelType {
  DEFAULT = 'default',
  FLAT = 'flat',
  LARGE_BIOMES = 'largeBiomes',
  AMPLIFIED = 'amplified',
  DEFAULT_1_1 = 'default_1_1',
}

/**
 * Enumeration of all the different entity actions
 *
 * Used in the following packets:
 * - EntityActionPacket
 */
export enum EntityAction {
  START_SNEAKING = 0,
  STOP_SNEAKING = 1,
  /** Leave Bed is only sent when the "Leave Bed" button is clicked on the sleep GUI, not when waking up due today time. */
  LEAVE_BED = 2,
  START_SPRINTING = 3,
  STOP_SPRINTING = 4,
  JUMP_WITH_HORSE = 5,
  /** Open ridden horse inventory is only sent when pressing the inventory key on a horse - all other methods of opening a horse's inventory (involving right-clicking or shift-right-clicking it) do not use this packet. */
  OPEN_RIDDEN_HORSE_INVENTORY = 6,
}
