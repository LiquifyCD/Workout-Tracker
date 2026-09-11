const test = require("node:test");
const assert = require("node:assert/strict");

require("../data/programs.js");

test("the single profile uses the six-session 48-hour rotation", () => {
  assert.equal(globalThis.DIVINITY_PROFILES.length, 1);
  const profile = globalThis.DIVINITY_PROFILES[0];
  assert.equal(profile.defaultSchedule.length, 6);
  assert.equal(profile.defaultExpected, 7);
  assert.deepEqual(profile.defaultSchedule.map(day => day.id), [
    "rotation-day-1", "rotation-day-2", "rotation-day-3",
    "rotation-day-4", "rotation-day-5", "rotation-day-6"
  ]);
});

test("the rotation preserves PDF prescriptions", () => {
  const schedule = globalThis.DIVINITY_PROFILES[0].defaultSchedule;
  assert.deepEqual(schedule.map(day => day.exs.reduce((sum, exercise) => sum + Number(exercise[1]), 0)), [15, 14, 16, 11, 16, 12]);
  assert.deepEqual(schedule[0].exs[0].slice(0, 3), ["Smith machine incline press, ~30°", "2", "4–6"]);
  assert.equal(schedule[5].exs[0][6], "1 / 1");
});
