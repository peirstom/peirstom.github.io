import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const defaultTarget = path.resolve(projectRoot, "..");
const targetDir =
  process.env.PAGES_DIR !== undefined ? path.resolve(projectRoot, process.env.PAGES_DIR) : defaultTarget;

if (!fs.existsSync(targetDir)) {
  console.error(`Target GitHub Pages repo not found at ${targetDir}`);
  console.error("Set PAGES_DIR env var if it lives elsewhere.");
  process.exit(1);
}

console.log("Building site with Vite...");
execSync("npm run build", { stdio: "inherit", cwd: projectRoot });

if (!fs.existsSync(distDir)) {
  console.error("dist directory missing after build; aborting deploy.");
  process.exit(1);
}

const preserve = new Set([".git", "site", ".github", "README.md"]);

console.log(`Clearing existing files in ${targetDir} (except preserved entries)...`);
for (const entry of fs.readdirSync(targetDir)) {
  if (preserve.has(entry)) continue;
  fs.rmSync(path.join(targetDir, entry), { recursive: true, force: true });
}

console.log("Copying dist -> GitHub Pages repo...");
fs.cpSync(distDir, targetDir, { recursive: true });

const noJekyll = path.join(targetDir, ".nojekyll");
fs.writeFileSync(noJekyll, "");

console.log("Deploy assets copied.");
console.log(`Next steps: cd ${targetDir} && git add -A && git commit -m "Deploy site" && git push`);
