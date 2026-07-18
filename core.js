(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DivinityCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeRange(range) {
    const match = String(range || "").match(/(\d+)\D+(\d+)/);
    return match ? `${match[1]}-${match[2]}` : "";
  }

  function rangeMidpoint(range) {
    const normalized = normalizeRange(range);
    if (!normalized) return 0;
    const [min, max] = normalized.split("-").map(Number);
    return Math.round((min + max) / 2);
  }

  function decide(s1, s2, rir, range) {
    const normalized = normalizeRange(range);
    if (!normalized) throw new Error("Invalid rep range");
    const [min, max] = normalized.split("-").map(Number);
    const sets = s2 > 0 ? [s1, s2] : [s1];
    if (sets.some(rep => rep < min)) return { decision: "reduce", label: "Repeat or reduce", reason: "A set fell below the target range.", cls: "reduce" };
    if (rir > 2) return { decision: "rest", label: "Check recovery", reason: "RIR is high. Check effort, form, or fatigue before adding load.", cls: "rest" };
    if (sets.every(rep => rep >= max) && rir <= 1) return { decision: "increase", label: "Increase load", reason: "Top of range reached with ≤1 RIR.", cls: "increase" };
    if (sets.every(rep => rep >= max)) return { decision: "repeat", label: "Repeat, push harder", reason: "Top reps reached but RIR suggests more available.", cls: "repeat" };
    return { decision: "repeat", label: "Repeat load", reason: "Within range, not fully maxed yet.", cls: "repeat" };
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return { decide, escapeAttr: escapeHtml, escapeHtml, localDateKey, normalizeRange, rangeMidpoint };
});
