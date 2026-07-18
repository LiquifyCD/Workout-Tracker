(() => {
  "use strict";

  const ex = (id, name, sets, reps, note, aliases = []) => [name, sets, reps, note, id, aliases];
  const day = (dayName, type, title, focus, exs) => ({ day: dayName, type, title, focus, exs });
  const clone = value => JSON.parse(JSON.stringify(value));

  const fullBody = [
    day("Day 1", "Full body", "Full Body A", "Squat + push", [
      ex("leg-press-squat", "Leg press / squat", "2", "6–10", "Main lower", ["Leg press", "Squat variation"]),
      ex("incline-press", "Incline press", "2", "6–10", "Push"),
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "2", "6–10", "Pull"),
      ex("leg-curl", "Leg curl", "1–2", "8–12", "Hamstrings"),
      ex("curl-variation", "Curl variation", "1", "8–12", "Optional")
    ]),
    day("Day 2", "Full body", "Full Body B", "Hinge + pull", [
      ex("stiff-leg-deadlift", "Stiff-leg deadlift", "2", "6–10", "Hinge"),
      ex("close-grip-cable-row", "Close-grip cable row", "2", "6–10", "Back"),
      ex("pec-deck", "Pec deck", "1–2", "8–12", "Chest"),
      ex("lateral-raise", "Lateral raise", "1–2", "10–15", "Side delts"),
      ex("rope-triceps-extension", "Rope triceps extension", "1", "8–12", "Optional", ["Rope extension"])
    ]),
    day("Day 3", "Full body", "Full Body C", "Quad + shoulders", [
      ex("squat-variation", "Squat variation", "2", "6–10", "Quad"),
      ex("overhead-press", "Overhead press", "1–2", "6–10", "Shoulders"),
      ex("single-arm-lat-pulldown", "Single-arm lat pulldown", "2", "8–12", "Back"),
      ex("leg-extension", "Leg extension", "1–2", "8–12", "Quads"),
      ex("calf-raise", "Calf raise", "1–2", "8–15", "Calves")
    ])
  ];

  globalThis.DIVINITY_PROFILES = [
    {
      key: "alfred", name: "Alfred", color: "#b794f4", defaultExpected: 6,
      defaultSchedule: [
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
      ]
    },
    { key: "maja", name: "Maja", color: "#ffffff", defaultExpected: 3, defaultSchedule: clone(fullBody) },
    {
      key: "elias", name: "Elias", color: "#d6bcfa", defaultExpected: 4,
      defaultSchedule: [
        day("Day 1", "Upper", "Upper A", "Push/pull", [
          ex("incline-press", "Incline press", "2", "6–10", "Chest"), ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "2", "6–10", "Back"),
          ex("pec-deck", "Pec deck", "1", "8–12", "Chest"), ex("curl-variation", "Curl variation", "1–2", "8–12", "Biceps"),
          ex("rope-triceps-extension", "Rope triceps extension", "1–2", "8–12", "Triceps", ["Rope extension"])
        ]),
        day("Day 2", "Lower", "Lower A", "Quad", [
          ex("leg-press-squat", "Leg press / squat", "2", "6–10", "Quads"), ex("leg-curl", "Leg curl", "2", "8–12", "Hamstrings"),
          ex("leg-extension", "Leg extension", "1", "8–12", "Quads"), ex("calf-raise", "Calf raise", "2", "8–15", "Calves")
        ]),
        day("Day 3", "Upper", "Upper B", "Shoulders/back", [
          ex("overhead-press", "Overhead press", "2", "6–10", "Shoulders"), ex("close-grip-cable-row", "Close-grip cable row", "2", "6–10", "Back"),
          ex("lateral-raise", "Lateral raise", "1–2", "10–15", "Side delts"), ex("pec-deck", "Pec deck", "1", "8–12", "Chest"),
          ex("curl-variation", "Curl variation", "1", "8–12", "Biceps")
        ]),
        day("Day 4", "Lower", "Lower B", "Hinge", [
          ex("stiff-leg-deadlift", "Stiff-leg deadlift", "2", "6–10", "Hinge"), ex("squat-variation", "Squat variation", "1–2", "6–10", "Quads"),
          ex("leg-curl", "Leg curl", "1", "8–12", "Hamstrings"), ex("calf-raise", "Calf raise", "2", "8–15", "Calves")
        ])
      ]
    },
    { key: "jacqueline", name: "Jacqueline", color: "#c4b5fd", defaultExpected: 3, defaultSchedule: clone(fullBody) }
  ];
})();
