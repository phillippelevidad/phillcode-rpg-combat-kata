const { describe, it } = require("mocha");
const { expect } = require("chai");
const Character = require("../src/Character");
const Prop = require("../src/Prop");

describe("Character", () => {
  describe("A Character, when created, has...", () => {
    it("starts with 1000 health", () => {
      const char = new Character(0);
      expect(char.health).to.equal(1000);
    });
    it("starts at level 1", () => {
      const char = new Character(0);
      expect(char.level).to.equal(1);
    });
    it("starts alive", () => {
      const char = new Character(0);
      expect(char.isAlive).to.be.true;
    });
  });

  describe("Characters can Deal Damage to Characters", () => {
    it("subtracts damage from health", () => {
      const a = new Character(-1);
      const b = new Character(1);
      a.attack(b);
      expect(b.health).to.equal(900);
    });
    it("sets health to 0 when damage exceeds the current health", () => {
      const a = new Character(-1);
      const b = new Character(1);
      repeat(() => a.attack(b), 11);
      expect(b.health).to.equal(0);
    });
    it("dies when health becomes 0", () => {
      const a = new Character(-1);
      const b = new Character(1);
      repeat(() => a.attack(b), 10);
      expect(b.isAlive).to.be.false;
    });
    it("cannot damage itself", () => {
      const char = new Character(0);
      expect(() => char.attack(char)).to.throw();
    });
    it("increases damage by 50% when target is 5- below the attacker", () => {
      const a = new Character(-1);
      const b = new Character(1);
      repeat(() => a.levelUp(), 6);
      a.attack(b);
      expect(b.health).to.equal(850);
    });
    it("decreases damage by 50% when target is 5+ acima the attacker", () => {
      const a = new Character(-1);
      const b = new Character(1);
      repeat(() => b.levelUp(), 6);
      a.attack(b);
      expect(b.health).to.equal(950);
    });
  });

  describe("A Character can Heal a Character", () => {
    it("cannot heal a dead character", () => {
      const a = new Character(-1);
      const b = new Character(1);
      repeat(() => a.attack(b), 10);
      b.heal();
      expect(b.health).to.equal(0);
      expect(b.isAlive).to.be.false;
    });
    it("cannot raise health above 1000", () => {
      const a = new Character(-1);
      const b = new Character(1);
      a.attack(b);
      repeat(() => b.heal(), 2);
      expect(b.health).to.equal(1000);
    });
    it("can only heal itself", () => {
      const a = new Character(-1);
      const b = new Character(1);
      a.attack(b);
      b.heal();
      expect(b.health).to.equal(1000);
    });
  });

  describe("Characters can level up", () => {
    it("levels up by 1 one", () => {
      const char = new Character(0);
      char.levelUp();
      expect(char.level).to.equal(2);
      char.levelUp();
      expect(char.level).to.equal(3);
    });
  });

  describe("Characters have an attack Max Range", () => {
    it("has an attack range of 2 meters when created as a melee figher", () => {
      const char = new Character(0);
      expect(char.attackRange).to.equal(2);
    });
    it("has an attack range of 20 meters when created as a ranged figher", () => {
      const char = new Character(0, "ranged");
      expect(char.attackRange).to.equal(20);
    });
    it("has to be in range to deal damage to another character", () => {
      const a = new Character(-5);
      const b = new Character(5, "ranged");
      a.attack(b);
      expect(b.health).to.equal(1000);
      a.move(8);
      a.attack(b);
      expect(b.health).to.equal(900);
      b.move(10);
      b.attack(a);
      expect(a.health).to.equal(900);
    });
  });

  describe("Characters may belong to one or more Factions", () => {
    it("is not in any faction when created", () => {
      const char = new Character(0);
      expect(char.factions.length).to.equal(0);
    });
    it("can join or leave one or more factions", () => {
      const char = new Character(0);
      char.joinFaction("f1");
      char.joinFaction("f2");
      expect(char.factions.includes("f1")).to.be.true;
      expect(char.factions.includes("f2")).to.be.true;
      char.leaveFaction("f2");
      expect(char.factions.includes("f2")).to.be.false;
    });
    it("is considered an ally of characters in the same faction", () => {
      const a = new Character(0);
      const b = new Character(0);
      a.joinFaction("f1");
      b.joinFaction("f1");
      expect(a.isAlliedWith(b)).to.be.true;
    });
    it("cannot damage to an ally", () => {
      const a = new Character(0);
      const b = new Character(0);
      a.joinFaction("f1");
      b.joinFaction("f1");
      expect(() => a.attack(b)).to.throw();
    });
    it("can heal an ally", () => {
      const a = new Character(0);
      const b = new Character(0);
      a.attack(b);
      expect(b.health).not.to.equal(1000);
      a.joinFaction("f1");
      b.joinFaction("f1");
      a.heal(b);
      expect(b.health).to.equal(1000);
    });
  });

  describe("Interacting with Props", () => {
    it("can deal damage to props", () => {
      const char = new Character(0);
      const tree = new Prop(2000);
      char.attack(tree);
      expect(tree.health).to.equal(1900);
    });
    it("cannot heal a prop", () => {
      const char = new Character(0);
      const tree = new Prop(2000);
      char.attack(tree);
      expect(() => char.heal(tree)).to.throw();
    });
  });
});

function repeat(action, times) {
  for (let i = 0; i < times; i++) {
    action();
  }
}
