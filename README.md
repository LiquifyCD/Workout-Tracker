# Divinity Workout Tracker

Installable workout PWA using Supabase Auth and Postgres persistence.

## Tracking

- Logs one work or warm-up set per save.
- Generates the current, completed, and upcoming sets from the active programme.
- Captures exercise, rep range, set number, and scheduled set count with each set so later programme edits do not rewrite history.
- Starts and persists the rest timer after every saved set.
- Supports skipped sets, editing, soft-delete, and undo.
- Queues new sets locally while offline and syncs them after reconnecting.
- Tracks weight, reps, volume, estimated 1RM, load PRs, and recent-versus-prior performance.

The old `daily_checkins` table is deliberately left untouched so historical body-weight data is not destroyed. The app no longer reads, validates, writes, imports, or reports daily check-ins. Body weight is now an optional profile value used only for relative strength standards.

## Strength standards

Supported exact movements:

- Barbell squat (`squat-variation`)
- Stiff-leg deadlift
- Incline bench press
- Shoulder/overhead press

The app estimates 1RM with the Epley formula, divides it by profile body weight, and compares that ratio with the selected men's or women's reference. Levels are Beginner, Novice, Intermediate, Advanced, and Elite. Warm-ups are excluded. Machine exercises and ambiguous combinations such as “leg press / squat” are shown as unsupported rather than treated as equivalent.

Reference tables were checked on 2026-07-28:

- [Squat standards](https://strengthlevel.com/strength-standards/squat)
- [Stiff-leg deadlift standards](https://strengthlevel.com/strength-standards/stiff-leg-deadlift)
- [Incline bench press standards](https://strengthlevel.com/strength-standards/incline-bench-press/lb)
- [Shoulder press standards](https://strengthlevel.com/strength-standards/shoulder-press/lb)

These are community training-log benchmarks, not general-population norms or medical advice. A calculated level uses estimated 1RM rather than a judged competition lift.

## Supabase setup

Apply migrations in timestamp order, including:

```text
supabase/migrations/20260728150000_add_per_set_tracking.sql
```

It adds profile-level standard inputs and non-destructive per-set snapshots. Existing owner-based Row Level Security remains in force. The browser contains only a publishable Supabase key; never add a secret or service-role key.

## Development

```powershell
npm.cmd install
npm.cmd test
python -m http.server 8000
```

Open `http://localhost:8000`. Test iPhone 13 sizing at `390 × 844` and desktop at `2560 × 1440`.
