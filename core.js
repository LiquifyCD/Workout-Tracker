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

  function parseDecimal(value) {
    const normalized = String(value ?? "").trim().replace(",", ".");
    return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
  }

  function rangeMidpoint(range) {
    const normalized = normalizeRange(range);
    if (!normalized) return 0;
    const [min, max] = normalized.split("-").map(Number);
    return Math.round((min + max) / 2);
  }

  function parseSetPlan(value) {
    const numbers = String(value || "").match(/\d+/g)?.map(Number) || [];
    const minimum = numbers[0] || 1;
    const maximum = numbers.length > 1 ? numbers.at(-1) : minimum;
    return {
      minimum,
      maximum: Math.max(minimum, maximum),
      optional: /optional/i.test(String(value || "")) || maximum > minimum
    };
  }

  function scheduledSetSlots(day, entries = []) {
    const slots = [];
    for (const exercise of day?.exs || []) {
      const exerciseId = exerciseIdentity(exercise);
      const plan = parseSetPlan(exercise[1]);
      const completed = entries
        .filter(entry => entry.exerciseId === exerciseId)
        .slice()
        .sort((a, b) => (a.setNumber || 0) - (b.setNumber || 0));
      for (let number = 1; number <= plan.maximum; number++) {
        slots.push({
          exercise,
          exerciseId,
          number,
          total: plan.maximum,
          optional: plan.optional && (plan.maximum === plan.minimum || number > plan.minimum),
          entry: completed.find(item => item.setNumber === number) || completed[number - 1] || null
        });
      }
    }
    return slots;
  }

  function estimatedOneRepMax(load, reps) {
    const weight = Number(load);
    const repetitions = Number(reps);
    if (!Number.isFinite(weight) || weight < 0 || !Number.isInteger(repetitions) || repetitions < 1) return null;
    return Math.round((repetitions === 1 ? weight : weight * (1 + repetitions / 30)) * 10) / 10;
  }

  function setVolume(load, reps) {
    const weight = Number(load);
    const repetitions = Number(reps);
    return Number.isFinite(weight) && Number.isInteger(repetitions) && repetitions > 0
      ? Math.round(weight * repetitions * 10) / 10
      : 0;
  }

  const STRENGTH_STANDARDS = {
    "squat-variation": {
      label: "Barbell squat",
      source: "https://strengthlevel.com/strength-standards/squat",
      male: [0.75, 1.25, 1.75, 2.25, 2.75],
      female: [0.50, 0.75, 1.25, 1.75, 2.25]
    },
    "stiff-leg-deadlift": {
      label: "Stiff-leg deadlift",
      source: "https://strengthlevel.com/strength-standards/stiff-leg-deadlift",
      male: [0.75, 1.00, 1.50, 2.00, 2.75],
      female: [0.50, 0.75, 1.00, 1.50, 2.00]
    },
    "incline-press": {
      label: "Incline bench press",
      source: "https://strengthlevel.com/strength-standards/incline-bench-press/lb",
      male: [0.50, 0.75, 1.00, 1.50, 1.75],
      female: [0.25, 0.40, 0.65, 0.95, 1.25]
    },
    "overhead-press": {
      label: "Shoulder press",
      source: "https://strengthlevel.com/strength-standards/shoulder-press/lb",
      male: [0.35, 0.55, 0.80, 1.05, 1.35],
      female: [0.20, 0.35, 0.50, 0.70, 0.95]
    }
  };

  function strengthClassification(exerciseId, sex, bodyWeight, oneRepMax) {
    const standard = STRENGTH_STANDARDS[exerciseId];
    if (!standard) return { supported: false, reason: "No like-for-like standard is available for this exercise." };
    if (!["male", "female"].includes(sex)) return { supported: true, ready: false, reason: "Choose male or female reference data." };
    const weight = Number(bodyWeight);
    const max = Number(oneRepMax);
    if (!Number.isFinite(weight) || weight <= 0) return { supported: true, ready: false, reason: "Add profile body weight to calculate a relative standard." };
    if (!Number.isFinite(max) || max < 0) return { supported: true, ready: false, reason: "Log a work set to calculate estimated 1RM." };
    const labels = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"];
    const ratio = max / weight;
    const thresholds = standard[sex];
    let index = 0;
    thresholds.forEach((threshold, candidate) => { if (ratio >= threshold) index = candidate; });
    return {
      supported: true,
      ready: true,
      label: standard.label,
      level: labels[index],
      ratio: Math.round(ratio * 100) / 100,
      threshold: thresholds[index],
      nextLevel: index < labels.length - 1 ? labels[index + 1] : null,
      nextThreshold: index < labels.length - 1 ? thresholds[index + 1] : null,
      belowBeginner: ratio < thresholds[0],
      source: standard.source
    };
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
    if ((value.entries?.length || 0) > 100000) throw new Error("Backup contains too many workout entries.");
    if ((value.checkins?.length || 0) > 20000) throw new Error("Backup contains too many check-ins.");
    if (Object.keys(value.profiles || {}).length > 20) throw new Error("Backup contains too many profiles.");
    return value;
  }

  function normalizeSchedule(schedule) {
    if (!Array.isArray(schedule) || !schedule.length || schedule.length > 14) throw new Error("Schedule must contain 1–14 days.");
    const dayNames = new Set();
    const dayIds = new Set();
    return schedule.map((item, dayIndex) => {
      const day = String(item?.day || "").trim();
      const id = String(item?.id || slugifyExercise(day)).trim();
      const title = String(item?.title || "").trim();
      const focus = String(item?.focus || item?.type || "").trim();
      const type = String(item?.type || focus).trim();
      if (!day || !title) throw new Error(`Schedule day ${dayIndex + 1} needs a day label and title.`);
      const dayKey = day.toLocaleLowerCase();
      if (dayNames.has(dayKey)) throw new Error(`Day label "${day}" is duplicated.`);
      dayNames.add(dayKey);
      if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)) throw new Error(`${day}: stable day ID is invalid.`);
      if (dayIds.has(id)) throw new Error(`Stable day ID "${id}" is duplicated.`);
      dayIds.add(id);
      if (!Array.isArray(item.exs) || !item.exs.length) throw new Error(`${day} needs at least one exercise.`);
      const exerciseIds = new Set();
      const exs = item.exs.map((exercise, exerciseIndex) => {
        const name = String(exercise?.[0] || "").trim();
        const sets = String(exercise?.[1] || "").trim();
        const reps = normalizeRange(exercise?.[2]);
        const note = String(exercise?.[3] || "").trim();
        const id = String(exercise?.[4] || slugifyExercise(name)).trim();
        const aliases = Array.isArray(exercise?.[5]) ? exercise[5].map(alias => String(alias).trim()).filter(Boolean) : [];
        if (!name || !sets || !reps) throw new Error(`${day}, exercise ${exerciseIndex + 1} needs a name, sets, and rep range.`);
        if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(id)) throw new Error(`${day}: "${name}" has an invalid stable ID.`);
        if (exerciseIds.has(id)) throw new Error(`${day}: stable ID "${id}" is duplicated.`);
        exerciseIds.add(id);
        return [name, sets, reps, note, id, [...new Set(aliases)]];
      });
      return { id, day, type, title, focus, exs };
    });
  }

  return { decide, escapeAttr: escapeHtml, escapeHtml, estimatedOneRepMax, exerciseIdentity, isUuid, localDateKey, normalizeRange, normalizeSchedule, parseDecimal, parseSetPlan, personalRecord, progressSeries, rangeMidpoint, scheduledSetSlots, setVolume, slugifyExercise, strengthClassification, validateBackup };
});
