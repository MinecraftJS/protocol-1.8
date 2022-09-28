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
 * - RespawnPacket
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

/**
 * Enumeration of all the different chat positions
 *
 * Used in the following packets:
 * - ChatMessagePacket
 */
export enum ChatPosition {
  CHAT_BOX = 0,
  SYSTEM_MESSAGE = 1,
  ABOVE_HOTBAR = 2,
}

/**
 * Enumeration of all the differnt animations that the client can play
 *
 * Used in the following packets:
 * - AnimationPacket
 */
export enum Animation {
  SWING_ARM = 0,
  TAKE_DAMAGE = 1,
  LEAVE_BED = 2,
  EAT_FOOD = 3,
  CRITICAL_EFFECT = 4,
  MAGIC_CRITICAL_EFFECT = 5,
}

/**
 * Enumeration of all the different entity statuses.
 *
 * Used in the following packets:
 * - EntityStatusPacket
 */
export enum EntityStatus {
  /** Sent when resetting a mob spawn minecart's timer / Rabbit jump animation */
  ONE = 1,
  LIVING_ENTITY_HURT = 2,
  LIVING_ENTITY_DEAD = 3,
  /** Iron Golem throwing up arms */
  IRON_GOLEM_ARMS = 4,
  /** Wolf/Ocelot/Horse taming — Spawn “heart” particles */
  TAMING_HEART_PARTICLES = 6,
  /** 	Wolf/Ocelot/Horse tamed — Spawn “smoke” particles */
  TAMED_SMOKE_PARTICLES = 7,
  /** Wolf shaking water — Trigger the shaking animation */
  WOLF_SHAKING_WATER = 8,
  /** (of self) Eating accepted by server */
  EATING_ACCEPTED = 9,
  /** Sheep eating grass */
  SHEEP_EATING_GRASS = 10,
  /** Play TNT ignite sound */
  TNT_IGNITE_SOUND = 10,
  /** Iron Golem handing over a rose */
  IRON_GOLEM_ROSE = 11,
  /** Villager mating — Spawn “heart” particles */
  VILLAGER_MATING = 12,
  /** Spawn particles indicating that a villager is angry and seeking revenge */
  VILLAGER_REVENGE = 13,
  /** Spawn happy particles near a villager */
  HAPPY_VILLAGER = 14,
  /** Witch animation — Spawn “magic” particles */
  WITCH_ANIMATION = 15,
  /** Play zombie converting into a villager sound */
  ZOMBIE_CONVERTING = 16,
  FIREWORK_EXPLODING = 17,
  /** Animal in love (ready to mate) — Spawn “heart” particles */
  ANIMAL_IN_LOVE = 18,
  RESET_SQUID_ROTATION = 19,
  /** Spawn explosion particle — works for some living entities */
  EXPLOSION_PARTICLE = 20,
  /** Play guardian sound — works for only for guardians */
  GUARDIAN_SOUND = 21,
  /** Enables reduced debug for players */
  ENABLE_REDUCED_DEBUG = 22,
  /** Disables reduced debug for players */
  DISABLE_REDUCED_DEBUG = 23,
}

/**
 * Enumeration of the diffent operations
 * that are applicable on a modifier
 *
 * Used in the following packets:
 * - EntityPropertiesPacket
 */
export enum ModifierOperation {
  /** Add/subtract amount */
  ADD_SUBSTRACT = 0,
  /** Add/subtract amount percent of the current value */
  ADD_SUBSTRACT_PERCENT = 1,
  /** Multiply by amount percent */
  MULTIPLY_PERCENT = 3,
}
