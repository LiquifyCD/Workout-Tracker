import { cp, mkdir, rm } from "node:fs/promises";

const files = [
  "index.html", "styles.css", "app.js", "core.js", "sw.js", "site.webmanifest",
  "favicon.ico", "favicon-16x16.png", "favicon-32x32.png", "favicon-48x48.png",
  "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png",
  "divinity-icon.png", "data", "media"
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await Promise.all(files.map(file => cp(file, `dist/${file}`, { recursive: true })));
