class Prop {
  #health;

  constructor(health) {
    this.#health = health;
  }

  get health() {
    return this.#health;
  }

  get isDestroyed() {
    return this.#health === 0;
  }

  takeDamage(damage) {
    this.#health = Math.max(0, this.#health - damage);
  }
}

module.exports = Prop;
