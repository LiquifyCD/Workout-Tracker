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
  assert.deepEqual(schedule[0].exs[0].slice(0, 3), ["Wide-grip lat pulldown", "2", "4–7"]);
});

test("the schedule has no hinge or single-arm pulldown and no repeated exercise within a day", () => {
  const schedule = globalThis.DIVINITY_PROFILES[0].defaultSchedule;
  const ids = schedule.flatMap(day => day.exs.map(exercise => exercise[4]));
  assert.ok(!ids.includes("stiff-leg-deadlift"));
  assert.ok(!ids.includes("single-arm-lat-pulldown"));
  assert.ok(!ids.includes("curl-variation"));
  for (const day of schedule) {
    const dayIds = day.exs.map(exercise => exercise[4]);
    assert.equal(new Set(dayIds).size, dayIds.length, `${day.day} repeats an exercise`);
  }
});

test("upper days are 7-8 exercises, lower days are 3-4, and no exercise exceeds two sets", () => {
  const schedule = globalThis.DIVINITY_PROFILES[0].defaultSchedule;
  for (const day of schedule) {
    const [min, max] = day.type === "Upper" ? [7, 8] : [3, 4];
    assert.ok(day.exs.length >= min && day.exs.length <= max, `${day.day} has ${day.exs.length} exercises`);
    for (const exercise of day.exs) assert.match(exercise[1], /^[12](–2)?$/, `${exercise[0]} sets`);
  }
});

test("rotating curl variations and the calf split are in place", () => {
  const schedule = globalThis.DIVINITY_PROFILES[0].defaultSchedule;
  const curlIds = [0, 2, 4].map(index => schedule[index].exs.at(-1)[4]);
  assert.deepEqual(curlIds, ["incline-curl", "preacher-curl", "hammer-curl"]);
  assert.ok(schedule[3].exs.some(exercise => exercise[4] === "seated-calf-raise"));
});
