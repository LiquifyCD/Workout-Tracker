const test = require("node:test");
const assert = require("node:assert/strict");
const { decide, escapeHtml, localDateKey, normalizeRange, rangeMidpoint } = require("../core.js");

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
