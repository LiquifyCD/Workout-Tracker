const test = require("node:test");
const assert = require("node:assert/strict");
const { decide, escapeHtml, estimatedOneRepMax, exerciseIdentity, isUuid, localDateKey, normalizeRange, normalizeSchedule, parseDecimal, parseSetPlan, personalRecord, progressSeries, rangeMidpoint, scheduledSetSlots, setVolume, slugifyExercise, strengthClassification, validateBackup } = require("../core.js");

test("escapes stored HTML before rendering", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert(1)">'`), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&#39;");
});

test("normalizes schedule ranges", () => {
  assert.equal(normalizeRange("6–10"), "6-10");
  assert.equal(rangeMidpoint("6–10"), 8);
});

test("applies double progression decisions", () => {
  assert.equal(decide(10, 10, 1, "6-10").decision, "increase");
  assert.equal(decide(5, 6, 1, "6-10").decision, "reduce");
  assert.equal(decide(8, 8, 1, "6-10").decision, "repeat");
  assert.equal(decide(8, 8, 3, "6-10").decision, "rest");
});

test("uses the browser-local calendar date", () => {
  const date = new Date(2026, 6, 18, 0, 30);
  assert.equal(localDateKey(date), "2026-07-18");
});

test("keeps exercise identity stable across display-name changes", () => {
  assert.equal(exerciseIdentity(["New display name", "2", "6–10", "", "stable-id"]), "stable-id");
  assert.equal(slugifyExercise("Wide-grip Lat Pulldown"), "wide-grip-lat-pulldown");
});

test("excludes warm-ups from records and progression", () => {
  const entries = [
    { exerciseId: "press", setType: "work", load: 80, created: "2026-07-01", date: "2026-07-01" },
    { exerciseId: "press", setType: "warmup", load: 100, created: "2026-07-02", date: "2026-07-02" },
    { exerciseId: "press", setType: "work", load: 85, created: "2026-07-03", date: "2026-07-03" }
  ];
  assert.equal(personalRecord(entries, "press").load, 85);
  assert.deepEqual(progressSeries(entries, "press").map(entry => entry.load), [80, 85]);
});

test("validates backup shape and UUIDs", () => {
  assert.equal(validateBackup({ entries: [], profiles: {}, checkins: [] }).entries.length, 0);
  assert.throws(() => validateBackup({ entries: {} }), /entries/);
  assert.equal(isUuid("4d6f03a9-01ad-4f52-8c0d-12ca6f531976"), true);
  assert.equal(isUuid("not-an-id"), false);
});

test("normalizes and validates edited schedules before persistence", () => {
  const schedule = normalizeSchedule([{ day: " Push ", type: "Upper", title: " Push day ", focus: "Chest", exs: [["Incline press", "2", "6–10", "", "incline-press", ["Press"]]] }]);
  assert.equal(schedule[0].day, "Push");
  assert.equal(schedule[0].id, "push");
  assert.equal(schedule[0].exs[0][2], "6-10");
  const renamed = normalizeSchedule([{...schedule[0], day: "Upper A"}]);
  assert.equal(renamed[0].id, "push");
  assert.throws(() => normalizeSchedule([{...schedule[0]}, {...schedule[0]}]), /duplicated/);
  assert.throws(() => normalizeSchedule([{...schedule[0]}, {...schedule[0], day: "Pull"}]), /Stable day ID/);
  assert.throws(() => normalizeSchedule([{...schedule[0], exs: []}]), /at least one exercise/);
});

test("accepts decimal loads with a point or comma", () => {
  assert.equal(parseDecimal("72.25"), 72.25);
  assert.equal(parseDecimal("72,25"), 72.25);
  assert.equal(Number.isNaN(parseDecimal("72kg")), true);
});

test("turns schedule set ranges into deterministic set plans", () => {
  assert.deepEqual(parseSetPlan("2"), { minimum: 2, maximum: 2, optional: false });
  assert.deepEqual(parseSetPlan("1–2"), { minimum: 1, maximum: 2, optional: true });
  assert.deepEqual(parseSetPlan("1 optional"), { minimum: 1, maximum: 1, optional: true });
});

test("programme changes affect future slots without rewriting logged snapshots", () => {
  const entry = { exerciseId: "press", setNumber: 1, scheduledSets: 2, load: 80 };
  const original = { exs: [["Press", "2", "6–10", "", "press"]] };
  const changed = { exs: [["Renamed press", "3", "5–8", "", "press"]] };
  assert.equal(scheduledSetSlots(original, [entry]).filter(slot => !slot.entry).length, 1);
  assert.equal(scheduledSetSlots(changed, [entry]).filter(slot => !slot.entry).length, 2);
  assert.deepEqual(entry, { exerciseId: "press", setNumber: 1, scheduledSets: 2, load: 80 });
});

test("calculates per-set volume and estimated 1RM", () => {
  assert.equal(setVolume(80, 8), 640);
  assert.equal(estimatedOneRepMax(80, 8), 101.3);
  assert.equal(estimatedOneRepMax(80, 1), 80);
});

test("classifies supported lifts and explains unsupported ones", () => {
  const result = strengthClassification("squat-variation", "female", 60, 75);
  assert.equal(result.level, "Intermediate");
  assert.equal(result.ratio, 1.25);
  assert.equal(strengthClassification("leg-press-squat", "male", 80, 160).supported, false);
  assert.equal(strengthClassification("incline-press", "", 80, 100).ready, false);
});

test("rejects unreasonably large backups", () => {
  assert.throws(() => validateBackup({ entries: Array(100001) }), /too many workout/);
  assert.throws(() => validateBackup({ checkins: Array(20001) }), /too many check-ins/);
});
