import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, "..");

const configPath = path.join(process.cwd(), "config.yml");
const outputPath = path.join(frontendRoot, "src", "lib", "config.ts");

if (!fs.existsSync(configPath)) {
  console.error(`config.yml not found at ${configPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(configPath, "utf8");
const config = yaml.load(raw);

const ts = `// Auto-generated from config.yml - DO NOT EDIT
export const CONFIG = ${JSON.stringify(config, null, 2)} as const;
export type Config = typeof CONFIG;
`;

fs.writeFileSync(outputPath, ts, "utf8");
console.log(`Config generated at ${outputPath}`);
