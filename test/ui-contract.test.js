const test = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "styles.css"), "utf8");
const app = readFileSync(join(root, "app.js"), "utf8");
const serviceWorker = readFileSync(join(root, "sw.js"), "utf8");

test("login uses the verified video with accessible motion fallback", () => {
  assert.match(html, /class="login-video" muted loop playsinline preload="metadata"/);
  assert.match(html, /supabase-js@2\.110\.7"[^>]+defer/);
  assert.match(html, /\.\/media\/login-background\.mp4/);
  assert.match(app, /video\.play\(\)\.catch/);
  assert.match(css, /\.auth,.profile-screen\{[^}]*align-items:center;justify-content:center/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.login-video\{display:none\}/);
  assert.match(serviceWorker, /url\.pathname\.endsWith\("\.mp4"\)/);
});

test("saved schedule changes refresh editable day controls", () => {
  assert.match(app, /id="ed-day-\$\{idx\}"/);
  assert.match(app, /Schedule saved and verified/);
  assert.match(app, /editorProfileKey===currentProfileKey\)fillDaySelect\(selectedDay\)/);
  assert.match(app, /schedule_day_id:d\.id/);
  assert.match(app, /d\.id===c\.dayId/);
});

test("offline install does not depend on the external Supabase CDN", () => {
  assert.match(serviceWorker, /const CACHE = "divinity-v6"/);
  const shell = serviceWorker.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1] || "";
  assert.doesNotMatch(shell, /SUPABASE_CDN/);
  assert.match(serviceWorker, /event\.waitUntil\(caches\.open\(CACHE\)\.then\(cache => cache\.put/);
});

test("forms and modal status are accessible", () => {
  for (const id of ["log-profile", "log-day", "log-ex", "log-load", "log-s1", "log-rir", "log-range", "log-notes", "progress-exercise", "progress-metric", "strength-sex", "strength-bodyweight", "edit-profile", "edit-expected"]) {
    assert.match(html, new RegExp(`<label for="${id}">`));
  }
  assert.match(html, /id="auth-msg"[^>]+aria-live="polite"/);
  assert.match(app, /element\.inert=!!modal/);
});

test("daily body-weight check-in is removed without a destructive data migration", () => {
  assert.doesNotMatch(html, /checkin-weight|Daily check-in/);
  assert.doesNotMatch(app, /from\("daily_checkins"\)/);
  assert.doesNotMatch(app, /body_weight_kg:numeric/);
});

test("workouts are logged one scheduled set at a time", () => {
  assert.doesNotMatch(html, /id="log-s2"/);
  assert.match(html, /id="workout-plan"/);
  assert.match(app, /scheduledSetSlots\(day,logged\)/);
  assert.match(app, /set_2_reps:null/);
  assert.match(app, /startRestTimer\(setType==="warmup"\?60:120\)/);
  assert.match(app, /workout_session_id/);
  assert.match(app, /set_number/);
  assert.match(app, /scheduled_sets_snapshot/);
});

test("set logging survives reload and offline use", () => {
  assert.match(app, /divinity-pending-workout-entries-v1/);
  assert.match(app, /writePendingEntries/);
  assert.match(app, /divinity-rest-timer-ends-at/);
  assert.match(app, /restoreRestTimer/);
  assert.match(app, /divinity-log-draft/);
});

test("progress and sourced strength standards are exposed", () => {
  assert.match(html, /Best estimated 1RM/);
  assert.match(html, /Recent volume/);
  assert.match(html, /Strength standards/);
  assert.match(app, /strengthClassification/);
  assert.match(app, /setVolume/);
  assert.match(app, /estimatedOneRepMax/);
});

test("mobile controls avoid automatic zoom and load accepts decimals", () => {
  assert.match(html, /id="log-load" type="text" inputmode="decimal"/);
  assert.match(app, /parseDecimal\(qs\("log-load"\)\.value\)/);
  assert.match(app, /min-width: 901px\) and \(pointer: fine/);
  assert.doesNotMatch(app, /recovery-password"\)\.focus/);
  assert.match(css, /button,input,select,textarea\{font:inherit;touch-action:manipulation\}/);
  assert.match(css, /@media\(max-width:900px\)[\s\S]*input,select,textarea\{font-size:16px\}/);
});

test("settings are split into focused sections", () => {
  assert.match(html, /Training plan/);
  assert.match(html, /Data &amp; storage/);
  assert.match(html, /<h2>Account<\/h2>/);
});
