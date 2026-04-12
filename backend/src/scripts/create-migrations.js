import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

// extract name=user-schema
const nameArg = args.find(arg => arg.startsWith("name="));

if (!nameArg) {
  console.error("Please provide name=your-migration-name");
  process.exit(1);
}

const name = nameArg.split("=")[1];

// sanitize name
const safeName = name.replace(/\s+/g, "_").toLowerCase();

// get migrations folder
const migrationsDir = path.join(process.cwd(), "migrations");

// ensure folder exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir);
}

// get next migration number
const files = fs.readdirSync(migrationsDir);

const numbers = files
  .map(f => parseInt(f.split("_")[0]))
  .filter(n => !isNaN(n));

const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

// pad number → 001, 002
const padded = String(nextNumber).padStart(3, "0");

const filename = `${padded}_${safeName}.sql`;

const filePath = path.join(migrationsDir, filename);

// create file with template
const template = `-- ${filename}

-- Write your migration below


`;

fs.writeFileSync(filePath, template);

console.log(`Created migration: ${filename}`);