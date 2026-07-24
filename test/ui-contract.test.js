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
  assert.match(app, /\.\.\.activeSchedule\(\)\.map\(day=>day\.day\)/);
});
