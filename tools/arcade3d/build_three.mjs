// Builds static/vendor/three-<version>.min.js (an IIFE that sets window.THREE) for the arcade games.
// Uses the three.js and esbuild packages already installed in tools/3d_src/node_modules:
//   node tools/arcade3d/build_three.mjs        (from the app folder)
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const modules = path.resolve(here, "../3d_src/node_modules");
const require = createRequire(path.join(modules, "noop.js"));
const esbuild = require("esbuild");
const version = JSON.parse(fs.readFileSync(path.join(modules, "three/package.json"), "utf8")).version;
const out = path.resolve(here, `../../static/vendor/three-${version}.min.js`);
await esbuild.build({
  entryPoints: [path.join(here, "three_entry.js")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2019",
  nodePaths: [modules],
  outfile: out,
  banner: { js: `/* three.js ${version} (https://threejs.org), MIT License, Copyright 2010-2025 three.js authors. Built by tools/arcade3d/build_three.mjs. */` },
  legalComments: "none",
});
console.log(out, Math.round(fs.statSync(out).size / 1024) + " KB");
