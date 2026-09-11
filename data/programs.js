(() => {
  "use strict";

  const ex = (id, name, sets, reps, jointAction, rir, aliases = []) => [name, sets, reps, jointAction, id, aliases, rir];
  const day = (id, dayName, type, title, focus, exs) => ({ id, day: dayName, type, title, focus, exs });
  const clone = value => JSON.parse(JSON.stringify(value));

  const rotation = [
    day("rotation-day-1", "Day 1", "Upper", "Upper · Chest priority", "15 sets · ~60 min", [
      ex("smith-incline-press", "Smith machine incline press, ~30°", "2", "4–6", "Shoulder flexion + adduction", "1 / 1", ["Incline dumbbell press"]),
      ex("pec-deck", "Pec deck", "2", "6–8", "Horizontal adduction", "1 / 0"),
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "2", "5–7", "Shoulder adduction", "2 / 0"),
      ex("chest-supported-row-tucked", "Chest-supported row, elbows tucked", "1", "5–7", "Shoulder extension", "— / 0"),
      ex("cable-rear-delt-fly", "Cable rear-delt fly, high pulleys crossed", "1", "8–10", "Horizontal abduction", "— / 0", ["Reverse pec deck"]),
      ex("lateral-raise-machine", "Lateral raise machine", "2", "6–8", "Shoulder abduction", "1 / 0"),
      ex("smith-shrug", "Smith machine shrug", "1", "8–10", "Scapular elevation", "— / 0"),
      ex("preacher-curl-machine", "Preacher curl machine", "2", "5–7", "Elbow flexion · distal", "1 / 0", ["EZ-bar preacher curl"]),
      ex("rope-pushdown", "Rope pushdown", "2", "6–8", "Elbow extension · all heads", "1 / 0")
    ]),
    day("rotation-day-2", "Day 2", "Lower", "Lower · Quad priority", "14 sets · ~55 min", [
      ex("smith-squat-feet-forward", "Smith machine squat, feet forward", "2", "5–7", "Knee extension · vasti", "1 / 1"),
      ex("leg-extension-reclined", "Leg extension, seat reclined", "2", "6–8", "Knee extension · rectus femoris", "1 / 0"),
      ex("lying-leg-curl-propped", "Lying leg curl, hips propped", "2", "6–8", "Knee flexion", "1 / 0"),
      ex("cable-pull-through", "Cable pull-through", "1", "8–10", "Hip extension", "— / 1"),
      ex("standing-calf-machine", "Standing calf machine", "2", "6–8", "Plantarflexion · gastroc", "1 / 0"),
      ex("seated-calf-machine", "Seated calf machine", "1", "8–12", "Plantarflexion · soleus", "— / 0"),
      ex("cable-hip-abduction-upright", "Cable hip abduction, torso upright", "1", "8–10", "Hip abduction", "— / 0"),
      ex("cable-hip-adduction", "Cable hip adduction", "1", "8–10", "Hip adduction", "— / 0"),
      ex("cable-crunch-45", "Cable crunch, stop at 45°", "2", "8–10", "Spinal flexion", "1 / 0")
    ]),
    day("rotation-day-3", "Day 3", "Upper", "Upper · Back priority", "16 sets · ~65 min", [
      ex("single-arm-cable-pulldown", "Single-arm cable pulldown, kneeling", "2", "6–8", "Shoulder extension", "2 / 0"),
      ex("chest-supported-row-flared", "Chest-supported row, elbows flared 60°", "2", "5–7", "Horizontal abduction", "2 / 0"),
      ex("neutral-grip-pulldown", "Neutral-grip pulldown", "1", "5–7", "Shoulder adduction", "— / 0"),
      ex("smith-shrug", "Smith machine shrug", "1", "8–10", "Scapular elevation", "— / 0"),
      ex("flat-dumbbell-bench", "Flat dumbbell bench press", "2", "4–6", "Horizontal adduction", "1 / 1", ["Bench press machine"]),
      ex("low-high-cable-fly", "Low-to-high cable fly", "2", "8–10", "Shoulder flexion + adduction", "1 / 0"),
      ex("cable-lateral-raise", "Cable lateral raise", "2", "6–8", "Shoulder abduction", "1 / 0"),
      ex("incline-dumbbell-curl", "Incline dumbbell curl, bench 45–60°", "2", "5–7", "Elbow flexion · proximal", "1 / 0"),
      ex("smith-jm-press", "Smith JM press", "1", "6–8", "Elbow extension", "1", ["Weighted dip machine"]),
      ex("rope-pushdown", "Rope pushdown", "1", "6–8", "Elbow extension · long head", "0")
    ]),
    day("rotation-day-4", "Day 4", "Lower", "Lower · Hinge priority", "11 sets · ~45 min", [
      ex("smith-rdl", "Smith machine RDL", "2", "5–7", "Hip extension", "1 / 1", ["Dumbbell RDL", "Barbell RDL"]),
      ex("lying-leg-curl-propped", "Lying leg curl, hips propped", "1", "6–8", "Knee flexion · BF short head", "— / 0"),
      ex("leg-press-45-deep", "45° leg press, deep", "1", "5–7", "Knee extension", "— / 1"),
      ex("seated-calf-machine", "Seated calf machine", "2", "8–12", "Plantarflexion · soleus", "1 / 0"),
      ex("standing-calf-machine", "Standing calf machine", "1", "6–8", "Plantarflexion · gastroc", "— / 0"),
      ex("cable-hip-adduction", "Cable hip adduction", "2", "8–10", "Hip adduction", "1 / 0"),
      ex("cable-hip-abduction-upright", "Cable hip abduction", "1", "8–10", "Hip abduction", "— / 0"),
      ex("weighted-decline-crunch", "Weighted decline crunch", "1", "8–10", "Spinal flexion", "— / 0")
    ]),
    day("rotation-day-5", "Day 5", "Upper", "Upper · Delt priority", "16 sets · ~65 min", [
      ex("smith-seated-shoulder-press", "Smith machine seated shoulder press", "2", "4–6", "Shoulder flexion", "1 / 1", ["Seated dumbbell press"]),
      ex("cable-lateral-raise-across", "Cable lateral raise, arm across body", "2", "6–8", "Shoulder abduction", "1 / 0"),
      ex("cable-rear-delt-fly", "Cable rear-delt fly, high pulleys crossed", "2", "8–10", "Horizontal abduction", "1 / 0"),
      ex("cable-fly-shoulder-height", "Cable fly, pulleys at shoulder height", "2", "6–8", "Horizontal adduction", "1 / 0"),
      ex("wide-grip-lat-pulldown", "Wide-grip lat pulldown", "1", "5–7", "Shoulder adduction", "— / 0"),
      ex("chest-supported-row-tucked", "Chest-supported row, elbows tucked", "1", "5–7", "Shoulder extension", "— / 0"),
      ex("smith-shrug", "Smith machine shrug", "2", "8–10", "Scapular elevation", "1 / 0"),
      ex("hammer-curl", "Hammer curl", "1", "6–8", "Elbow flexion · brachioradialis", "1"),
      ex("cable-curl", "Cable curl", "1", "6–8", "Elbow flexion · mid-range", "0"),
      ex("rope-pushdown", "Rope pushdown", "2", "6–8", "Elbow extension · all heads", "1 / 0")
    ]),
    day("rotation-day-6", "Day 6", "Lower", "Lower · Glute priority", "12 sets · ~50 min", [
      ex("smith-hip-thrust", "Smith machine hip thrust", "2", "6–8", "Hip extension · shortened", "1 / 1"),
      ex("lying-leg-curl-flat", "Lying leg curl, flat", "2", "6–8", "Knee flexion · shortened", "1 / 0"),
      ex("leg-extension", "Leg extension", "2", "6–8", "Knee extension", "1 / 0"),
      ex("cable-hip-abduction-hinged", "Cable hip abduction, torso hinged forward", "2", "8–10", "Hip abduction", "1 / 0"),
      ex("cable-hip-adduction", "Cable hip adduction", "1", "8–10", "Hip adduction", "— / 0"),
      ex("standing-calf-machine", "Standing calf machine", "1", "6–8", "Plantarflexion · gastroc", "— / 0"),
      ex("seated-calf-machine", "Seated calf machine", "1", "8–12", "Plantarflexion · soleus", "— / 0"),
      ex("cable-crunch-45", "Cable crunch, stop at 45°", "1", "8–10", "Spinal flexion", "— / 0")
    ])
  ];

  globalThis.DIVINITY_PROFILES = [
    { key: "alfred", name: "Alfred", color: "#ff6b35", defaultExpected: 7, defaultSchedule: clone(rotation) },
    { key: "maja", name: "Maja", color: "#ffb000", defaultExpected: 7, defaultSchedule: clone(rotation) },
    { key: "elias", name: "Elias", color: "#2dd4bf", defaultExpected: 7, defaultSchedule: clone(rotation) },
    { key: "jacqueline", name: "Jacqueline", color: "#f8fafc", defaultExpected: 7, defaultSchedule: clone(rotation) }
  ];
})();
