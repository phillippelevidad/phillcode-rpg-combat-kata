const { describe, it } = require("mocha");
const { expect } = require("chai");
const Prop = require("../src/Prop");

describe("Prop", () => {
  it("is destroyed when health reaches 0", () => {
    const p = new Prop(1000);
    p.takeDamage(1000);
    expect(p.isDestroyed).to.be.true;
  });
});
