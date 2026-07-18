# Divinity Workout Tracker

A lightweight group workout tracker hosted on GitHub Pages with Supabase Auth and Postgres persistence.

Features include stable exercise IDs and aliases, warm-up/work-set separation, progression charts and records, rest timer, daily readiness check-ins, recoverable trash, JSON backup restore, and an installable offline-aware PWA. Default programs live in `data/programs.js`; changing an exercise display name while keeping its ID preserves its history.

## Development

Serve the repository over HTTP, then open it in a browser:

```powershell
python -m http.server 8000
```

Run validation with:

```powershell
npm install
npm test
```

The publishable Supabase key is intentionally client-visible. Database access is protected by owner-based Row Level Security policies. Never add a secret or service-role key to this repository.
