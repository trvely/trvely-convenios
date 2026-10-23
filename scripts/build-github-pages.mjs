import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vinextCli = path.join(projectRoot, "node_modules", "vinext", "dist", "cli.js");
const clientDir = path.join(projectRoot, "dist", "client");
const manifestPath = path.join(projectRoot, "dist", "server", "vinext-prerender.json");
const buildStartedAt = Date.now();

const build = spawnSync(process.execPath, [vinextCli, "build"], {
  cwd: projectRoot,
  encoding: "utf8",
  env: process.env,
});

process.stdout.write(build.stdout ?? "");
process.stderr.write(build.stderr ?? "");

let exportIsComplete = false;
try {
  const [manifestText, manifestStats, htmlStats, coralHtmlStats] = await Promise.all([
    readFile(manifestPath, "utf8"),
    stat(manifestPath),
    stat(path.join(clientDir, "index.html")),
    stat(path.join(clientDir, "coopercar", "coral-costa-caribe.html")),
  ]);
  const manifest = JSON.parse(manifestText);
  exportIsComplete =
    manifest.routes?.some((route) => route.route === "/" && route.status === "rendered") &&
    manifest.routes?.some((route) => route.route === "/coopercar/coral-costa-caribe" && route.status === "rendered") &&
    manifestStats.mtimeMs >= buildStartedAt - 1000 &&
    htmlStats.mtimeMs >= buildStartedAt - 1000 &&
    coralHtmlStats.mtimeMs >= buildStartedAt - 1000 &&
    (build.stdout ?? "").includes("Build complete");
} catch {
  exportIsComplete = false;
}

if (build.status !== 0 && !(process.platform === "win32" && exportIsComplete)) {
  process.exit(build.status ?? 1);
}

if (build.status !== 0) {
  console.warn("[publicación] Vinext completó el export; se ignoró únicamente el fallo de cierre de libuv en Windows.");
}

const pageDir = path.join(clientDir, "coopercar");
const coralPageDir = path.join(pageDir, "coral-costa-caribe");
await mkdir(pageDir, { recursive: true });
await mkdir(coralPageDir, { recursive: true });
await Promise.all([
  copyFile(path.join(clientDir, "index.html"), path.join(pageDir, "index.html")),
  copyFile(path.join(clientDir, "index.rsc"), path.join(pageDir, "index.rsc")),
  copyFile(path.join(clientDir, "og-real.jpg"), path.join(pageDir, "og-real.jpg")),
  copyFile(path.join(pageDir, "coral-costa-caribe.html"), path.join(coralPageDir, "index.html")),
  copyFile(path.join(pageDir, "coral-costa-caribe.rsc"), path.join(coralPageDir, "index.rsc")),
  writeFile(path.join(clientDir, ".nojekyll"), "", "utf8"),
]);

console.log("[publicación] Paquetes listos en dist/client/coopercar/ y dist/client/coopercar/coral-costa-caribe/.");
