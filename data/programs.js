(() => {
  "use strict";

  const ex = (id, name, sets, reps, note, aliases = []) => [name, sets, reps, note, id, aliases];
  const day = (dayName, type, title, focus, exs) => ({ day: dayName, type, title, focus, exs });
  const clone = value => JSON.parse(JSON.stringify(value));

  const schedule = [
    day("Day 1", "Upper", "Upper — back priority", "Back first", [
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "2", "4–7", "Back first"),
      ex("chest-supported-row", "Chest-supported row", "1–2", "4–7", "Wide elbows, mid-back / rear delt"),
      ex("incline-press", "Incline press", "1–2", "4–7", "Upper chest frequency"),
      ex("lateral-raise", "Lateral raise", "2", "8–15", "Side delts", ["Cable lateral raise"]),
      ex("reverse-pec-deck", "Reverse pec deck", "1–2", "8–15", "Rear delts"),
      ex("rope-triceps-extension", "Rope triceps extension", "1–2", "6–10", "Direct triceps", ["Rope extension"]),
      ex("incline-curl", "Incline curl", "1–2", "6–10", "Proximal biceps")
    ]),
    day("Day 2", "Lower", "Lower — quad + curl", "Quad first", [
      ex("leg-press-squat", "Leg press / squat", "1–2", "4–7", "Quad stimulus", ["Leg press", "Squat variation"]),
      ex("leg-curl", "Leg curl", "2", "6–10", "Hamstrings, seated preferred", ["Seated leg curl"]),
      ex("calf-raise", "Calf raise", "1–2", "6–12", "Standing, controlled stretch")
    ]),
    day("Day 3", "Upper", "Upper — chest priority", "Chest first", [
      ex("incline-press", "Incline press", "2", "4–7", "Chest priority"),
      ex("pec-deck", "Pec deck", "1–2", "6–10", "Horizontal adduction"),
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "1–2", "4–7", "Lat stimulus"),
      ex("chest-supported-row", "Chest-supported row", "1", "4–7", "Wide elbows, upper back"),
      ex("lateral-raise", "Lateral raise", "1", "8–15", "Side delts", ["Cable lateral raise"]),
      ex("reverse-pec-deck", "Reverse pec deck", "1", "8–15", "Rear delts"),
      ex("rope-triceps-extension", "Rope extension", "1–2", "6–10", "Direct triceps", ["Rope triceps extension"]),
      ex("preacher-curl", "Preacher curl", "1–2", "6–10", "Distal biceps")
    ]),
    day("Day 4", "Lower", "Lower — quad + curl", "Quad first", [
      ex("squat-variation", "Squat variation", "1–2", "4–7", "Quad priority"),
      ex("leg-extension", "Leg extension", "1", "6–10", "Knee extension"),
      ex("leg-curl", "Leg curl", "1", "6–10", "Short-head coverage", ["Seated leg curl"]),
      ex("seated-calf-raise", "Seated calf raise", "1–2", "6–12", "Soleus (knee flexed)")
    ]),
    day("Day 5", "Upper", "Upper — shoulder priority", "Shoulders first", [
      ex("overhead-press", "Overhead press", "2", "4–7", "Shoulder priority"),
      ex("lateral-raise", "Lateral raise", "2", "8–15", "Side delts", ["Cable lateral raise"]),
      ex("reverse-pec-deck", "Reverse pec deck", "1–2", "8–15", "Rear delts"),
      ex("pec-deck", "Pec deck", "1–2", "6–10", "No incline today"),
      ex("close-grip-cable-row", "Close-grip cable row", "1", "4–7", "Elbows in, shoulder extension"),
      ex("rope-triceps-extension", "Rope extension", "1–2", "6–10", "Direct triceps", ["Rope triceps extension"]),
      ex("hammer-curl", "Hammer curl", "1–2", "6–10", "Brachioradialis", ["Cross-body curl"])
    ]),
    day("Day 6", "Lower", "Lower — quad + curl", "Quad first", [
      ex("leg-press-squat", "Leg press", "1–2", "4–7", "Quad stimulus", ["Leg press / squat"]),
      ex("leg-curl", "Leg curl", "2", "6–10", "Hamstrings, seated preferred", ["Seated leg curl"]),
      ex("calf-raise", "Calf raise", "1–2", "6–12", "Standing calves")
    ])
  ];

  globalThis.DIVINITY_PROFILES = [
    { key: "alfred", name: "Workout", color: "#8b5cf6", defaultExpected: 6, defaultSchedule: clone(schedule) }
  ];
})();
