(() => {
  "use strict";

  const ex = (id, name, sets, reps, note, aliases = []) => [name, sets, reps, note, id, aliases];
  const day = (dayName, type, title, focus, exs) => ({ day: dayName, type, title, focus, exs });
  const clone = value => JSON.parse(JSON.stringify(value));

  const schedule = [
    day("Day 1", "Upper", "Upper — back priority", "Back first", [
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "1–2", "4–7", "Back first"),
      ex("close-grip-cable-row", "Close-grip cable row", "1", "4–7", "Row / shoulder extension"),
      ex("pec-deck", "Pec deck", "1", "6–10", "Chest maintenance"),
      ex("rope-triceps-extension", "Rope triceps extension", "1–2", "6–10", "Direct triceps", ["Rope extension"]),
      ex("curl-variation", "Curl variation", "1–2", "6–10", "Direct biceps"),
      ex("lateral-raise", "Lateral raise", "1 optional", "8–15", "Only if side delts lag")
    ]),
    day("Day 2", "Lower", "Lower — hinge + quad", "Hinge first", [
      ex("stiff-leg-deadlift", "Stiff-leg deadlift", "1–2", "4–7", "Hinge priority"),
      ex("leg-curl", "Leg curl", "1", "6–10", "Short-head coverage"),
      ex("leg-press-squat", "Leg press / squat", "1–2", "4–7", "Quad stimulus", ["Leg press", "Squat variation"]),
      ex("calf-raise", "Calf raise", "1–2", "6–12", "Controlled stretch")
    ]),
    day("Day 3", "Upper", "Upper — chest priority", "Chest first", [
      ex("incline-press", "Incline press", "2", "4–7", "Chest priority"),
      ex("pec-deck", "Pec deck", "1", "6–10", "Horizontal adduction"),
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "1–2", "4–7", "Lat stimulus"),
      ex("jm-press", "JM press", "1", "4–7", "Triceps"),
      ex("rope-triceps-extension", "Rope extension", "1", "6–10", "All heads", ["Rope triceps extension"]),
      ex("curl-variation", "Curl variation", "1–2", "6–10", "Direct biceps")
    ]),
    day("Day 4", "Lower", "Lower — quad + curl", "Quad first", [
      ex("squat-variation", "Squat variation", "1–2", "4–7", "Quad priority"),
      ex("leg-extension", "Leg extension", "1", "6–10", "Knee extension"),
      ex("leg-curl", "Leg curl", "2", "6–10", "Curl priority, no hinge"),
      ex("calf-raise", "Calf raise", "1–2", "6–12", "Calves")
    ]),
    day("Day 5", "Upper", "Upper — shoulder priority", "Shoulders first", [
      ex("overhead-press", "Overhead press", "1–2", "4–7", "Shoulder priority"),
      ex("lateral-raise", "Lateral raise", "1–2", "8–15", "Side delts"),
      ex("pec-deck", "Pec deck", "1", "6–10", "No incline today"),
      ex("single-arm-lat-pulldown", "Single-arm lat pulldown", "1–2", "6–10", "Different lat angle"),
      ex("rope-triceps-extension", "Rope extension", "1–2", "6–10", "Direct triceps", ["Rope triceps extension"]),
      ex("curl-variation", "Curl variation", "1–2", "6–10", "Direct biceps")
    ]),
    day("Day 6", "Lower", "Lower — hinge + quad", "Hinge first", [
      ex("stiff-leg-deadlift", "Stiff-leg deadlift", "2", "4–7", "Hinge priority"),
      ex("leg-curl", "Leg curl", "1", "6–10", "Knee flexion coverage"),
      ex("leg-press-squat", "Leg press", "1–2", "4–7", "Quad stimulus", ["Leg press / squat"]),
      ex("calf-raise", "Calf raise", "1–2", "6–12", "Calves")
    ])
  ];

  globalThis.DIVINITY_PROFILES = [
    { key: "alfred", name: "Workout", color: "#8b5cf6", defaultExpected: 6, defaultSchedule: clone(schedule) }
  ];
})();
