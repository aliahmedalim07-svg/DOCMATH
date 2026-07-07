import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(frontendRoot, "..", "..");

const configName = process.env.CONFIG_NAME || "zeyad";
const configDir = path.join(repoRoot, "configs", configName);

const configSrc = path.join(configDir, "config.yml");
const configDest = path.join(frontendRoot, "config.yml");
const outputPath = path.join(frontendRoot, "src", "lib", "config.ts");

const publicSrc = path.join(configDir, "public");
const publicDest = path.join(frontendRoot, "public");

if (!fs.existsSync(configSrc)) {
  console.error(`Config not found: ${configSrc}`);
  process.exit(1);
}

fs.copyFileSync(configSrc, configDest);
console.log(`Copied configs/${configName}/config.yml → config.yml`);

const raw = fs.readFileSync(configDest, "utf8");
const config = yaml.load(raw);
const ts = `// Auto-generated from config.yml - DO NOT EDIT
export const CONFIG = ${JSON.stringify(config, null, 2)} as const;
export type Config = typeof CONFIG;
`;
fs.writeFileSync(outputPath, ts, "utf8");
console.log(`Config generated at ${outputPath}`);

if (fs.existsSync(publicSrc)) {
  const files = fs.readdirSync(publicSrc);
  for (const file of files) {
    const srcFile = path.join(publicSrc, file);
    const destFile = path.join(publicDest, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} → public/`);
    }
  }
}
