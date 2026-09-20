const test = require("node:test");
const assert = require("node:assert/strict");

require("../data/programs.js");

test("the single profile uses the six-day upper/lower schedule", () => {
  assert.equal(globalThis.DIVINITY_PROFILES.length, 1);
  const profile = globalThis.DIVINITY_PROFILES[0];
  assert.equal(profile.defaultSchedule.length, 6);
  assert.equal(profile.defaultExpected, 6);
  assert.deepEqual(profile.defaultSchedule.map(day => day.day), ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"]);
  assert.deepEqual(profile.defaultSchedule.map(day => day.type), ["Upper", "Lower", "Upper", "Lower", "Upper", "Lower"]);
});

test("the default schedule is not the retired 48-hour rotation", () => {
  const schedule = globalThis.DIVINITY_PROFILES[0].defaultSchedule;
  assert.ok(schedule.every(day => !String(day.id || "").startsWith("rotation-day-")));
  assert.equal(schedule[0].title, "Upper — back priority");
  assert.deepEqual(schedule[0].exs[0].slice(0, 3), ["Wide-grip lat pulldown", "1–2", "4–7"]);
});
