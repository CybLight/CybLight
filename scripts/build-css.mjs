/**
 * Concatenates css/parts/*.css into css/styles.css.
 * Edit files in css/parts/ — then run: npm run build:css
 *
 * One-time split from legacy monolith: node scripts/build-css.mjs --split
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PARTS_DIR = path.join(ROOT, "css", "parts");
const OUTPUT = path.join(ROOT, "css", "styles.css");

/** Load order: shared base → components → pages → responsive → extras */
const PART_FILES = [
  "variables.css",
  "base.css",
  "header.css",
  "home.css",
  "games.css",
  "footer.css",
  "modals.css",
  "projects.css",
  "contacts.css",
  "legal.css",
  "responsive.css",
  "misc.css",
];

const SPLIT_RANGES = [
  ["variables.css", 1, 36],
  ["base.css", 37, 167],
  ["header.css", 168, 814],
  ["home.css", 816, 1241],
  ["games.css", 1242, 1523],
  ["footer.css", 1524, 2011],
  ["modals.css", 2012, 2755],
  ["projects.css", 2756, 3077],
  ["contacts.css", 3078, 3459],
  ["legal.css", 3460, 3593],
  ["responsive.css", 3594, 4040],
  ["misc.css", 4041, 4226],
];

function splitLegacyStyles() {
  if (!fs.existsSync(OUTPUT)) {
    console.error("css/styles.css not found — nothing to split.");
    process.exit(1);
  }

  const lines = fs.readFileSync(OUTPUT, "utf8").split(/\r?\n/);
  fs.mkdirSync(PARTS_DIR, { recursive: true });

  for (const [name, start, end] of SPLIT_RANGES) {
    const chunk = lines.slice(start - 1, end).join("\n");
    const filePath = path.join(PARTS_DIR, name);
    fs.writeFileSync(filePath, chunk + (chunk.endsWith("\n") ? "" : "\n"), "utf8");
    console.log(`  wrote ${name} (${end - start + 1} lines)`);
  }

  console.log(`Split ${OUTPUT} into ${SPLIT_RANGES.length} parts under css/parts/`);
}

function buildStyles() {
  const chunks = [
    "/* AUTO-GENERATED — edit css/parts/*.css and run: npm run build:css */\n",
  ];

  for (const name of PART_FILES) {
    const filePath = path.join(PARTS_DIR, name);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing part: css/parts/${name}`);
      process.exit(1);
    }
    const content = fs.readFileSync(filePath, "utf8").trimEnd();
    chunks.push(`/* ===== css/parts/${name} ===== */\n`);
    chunks.push(content);
    chunks.push("\n\n");
  }

  fs.writeFileSync(OUTPUT, chunks.join("").replace(/\n{3,}/g, "\n\n") + "\n", "utf8");
  console.log(`Built ${OUTPUT} from ${PART_FILES.length} parts`);
}

if (process.argv.includes("--split")) {
  splitLegacyStyles();
} else {
  buildStyles();
}
