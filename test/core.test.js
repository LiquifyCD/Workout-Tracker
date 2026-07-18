const test = require("node:test");
const assert = require("node:assert/strict");
const { decide, escapeHtml, exerciseIdentity, isUuid, localDateKey, normalizeRange, personalRecord, progressSeries, rangeMidpoint, slugifyExercise, validateBackup } = require("../core.js");

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
