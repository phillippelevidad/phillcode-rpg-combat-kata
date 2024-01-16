const MAX_HEALTH = 1000;
const BASE_POWER = 100;
const STARTING_LEVEL = 1;

class Character {
  #health = MAX_HEALTH;
  #level = STARTING_LEVEL;
  #factions = new Set();
  #position;
  #attackRange;

  constructor(position, type = "melee") {
    if (!["melee", "ranged"].includes(type)) {
      throw new Error("Invalid character type. Use 'melee' or 'ranged'.");
    }
    this.#position = position;
    this.#attackRange = type === "melee" ? 2 : 20;
  }

  get health() {
    return this.#health;
  }

  get level() {
    return this.#level;
  }

  get isAlive() {
    return this.#health > 0;
  }

  get attackRange() {
    return this.#attackRange;
  }

  get factions() {
    return [...this.#factions];
  }

  attack(target) {
    if (target instanceof Character) {
      this.#attackCharacter(target);
    } else {
      this.#attackProp(target);
    }
  }

  #attackCharacter(target) {
    if (target === this) throw new Error("Cannot attack itself");
    if (this.isAlliedWith(target)) throw new Error("Cannot attack an ally");
    if (!this.#isInRange(target)) return;
    const damage = this.#getPower(target);
    target.#health = Math.max(0, target.#health - damage);
  }

  #attackProp(target) {
    target.takeDamage(BASE_POWER);
  }

  heal(target = null) {
    if (target === null) target = this;
    if (!(target instanceof Character)) {
      throw new Error("Can only heal a character");
    }
    if (target !== this && !target.isAlliedWith(this)) {
      throw new Error("Cannot heal a character from another faction");
    }
    if (!target.isAlive) return;
    const points = this.#getPower(this);
    target.#health = Math.min(MAX_HEALTH, target.#health + points);
  }

  levelUp() {
    this.#level++;
  }

  move(meters) {
    this.#position += meters;
  }

  joinFaction(faction) {
    this.#factions.add(faction);
  }

  leaveFaction(faction) {
    this.#factions.delete(faction);
  }

  isAlliedWith(other) {
    for (let faction of other.factions) {
      if (this.#factions.has(faction)) {
        return true;
      }
    }
    return false;
  }

  #getPower(target) {
    let modifier = 1;
    if (this.level - target.level >= 5) modifier = 1.5;
    if (target.level - this.level >= 5) modifier = 0.5;
    return BASE_POWER * modifier;
  }

  #isInRange(target) {
    const distance = Math.abs(this.#position - target.#position);
    return distance <= this.#attackRange;
  }
}

module.exports = Character;
