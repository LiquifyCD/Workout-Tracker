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
  const shell = serviceWorker.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1] || "";
  assert.doesNotMatch(shell, /SUPABASE_CDN/);
  assert.match(serviceWorker, /event\.waitUntil\(caches\.open\(CACHE\)\.then\(cache => cache\.put/);
});

test("forms and modal status are accessible", () => {
  for (const id of ["log-profile", "log-day", "log-ex", "log-load", "log-s1", "log-s2", "log-rir", "log-range", "log-notes", "edit-profile", "edit-expected"]) {
    assert.match(html, new RegExp(`<label for="${id}">`));
  }
  assert.match(html, /id="auth-msg"[^>]+aria-live="polite"/);
  assert.match(app, /element\.inert=!!modal/);
});
