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

  function slugifyExercise(name) {
    return String(name || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "exercise";
  }

  function exerciseIdentity(exercise) {
    return String(exercise?.[4] || slugifyExercise(exercise?.[0]));
  }

  function personalRecord(entries, exerciseId) {
    return entries
      .filter(entry => entry.exerciseId === exerciseId && entry.setType !== "warmup" && entry.load != null)
      .reduce((best, entry) => !best || entry.load > best.load ? entry : best, null);
  }

  function progressSeries(entries, exerciseId, limit = 20) {
    return entries
      .filter(entry => entry.exerciseId === exerciseId && entry.setType !== "warmup" && entry.load != null)
      .slice()
      .sort((a, b) => String(a.created).localeCompare(String(b.created)))
      .slice(-limit);
  }

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
  }

  function validateBackup(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Backup must be a JSON object.");
    if (value.entries != null && !Array.isArray(value.entries)) throw new Error("Backup entries must be an array.");
    if (value.profiles != null && (typeof value.profiles !== "object" || Array.isArray(value.profiles))) throw new Error("Backup profiles must be an object.");
    if (value.checkins != null && !Array.isArray(value.checkins)) throw new Error("Backup check-ins must be an array.");
    return value;
  }

  return { decide, escapeAttr: escapeHtml, escapeHtml, exerciseIdentity, isUuid, localDateKey, normalizeRange, personalRecord, progressSeries, rangeMidpoint, slugifyExercise, validateBackup };
});
