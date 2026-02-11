import path from "node:path";
import fs from "fs-extra";
import prompts from "prompts";
import { execSync } from "node:child_process";

const TEMPLATE_DIR = path.join(__dirname, "..", "template");

// Files/dirs that need to be renamed (prefixed with _ to avoid npm/git issues)
const RENAME_MAP: Record<string, string> = {
  _gitignore: ".gitignore",
  _github: ".github",
  "_env.example": ".env.example",
  _prettierrc: ".prettierrc",
  _prettierignore: ".prettierignore",
};

// Files where {{projectName}} placeholders should be replaced
const PLACEHOLDER_FILES = [
  "package.json",
  "apps/frontend/package.json",
  "apps/backend/package.json",
  "packages/shared/package.json",
  "apps/frontend/index.html",
];

function printBanner(): void {
  console.log("");
  console.log("\x1b[36m╔══════════════════════════════════════════╗\x1b[0m");
  console.log(
    "\x1b[36m║\x1b[0m  🚀 \x1b[1mCodingin Starterpack\x1b[0m                  \x1b[36m║\x1b[0m",
  );
  console.log(
    "\x1b[36m║\x1b[0m  React Vite + NestJS Fullstack Monorepo  \x1b[36m║\x1b[0m",
  );
  console.log("\x1b[36m╚══════════════════════════════════════════╝\x1b[0m");
  console.log("");
}

function toValidPackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/^[._]/, "")
    .replaceAll(/[^a-z\d\-~]+/g, "-");
}

async function main(): Promise<void> {
  printBanner();

  // Get project name from args or prompt
  const argProjectName = process.argv[2];

  let projectName: string;

  if (argProjectName) {
    projectName = argProjectName;
  } else {
    const response = await prompts(
      {
        type: "text",
        name: "projectName",
        message: "Project name:",
        initial: "my-fullstack-app",
        validate: (value: string) =>
          value.trim().length > 0 ? true : "Project name is required",
      },
      {
        onCancel: () => {
          console.log("\n\x1b[31m✖ Operation cancelled.\x1b[0m");
          process.exit(0);
        },
      },
    );
    projectName = response.projectName;
  }

  const packageName = toValidPackageName(projectName);
  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts(
      {
        type: "confirm",
        name: "overwrite",
        message: `Directory "${projectName}" already exists. Overwrite?`,
        initial: false,
      },
      {
        onCancel: () => {
          console.log("\n\x1b[31m✖ Operation cancelled.\x1b[0m");
          process.exit(0);
        },
      },
    );

    if (!overwrite) {
      console.log("\x1b[31m✖ Operation cancelled.\x1b[0m");
      process.exit(0);
    }

    fs.removeSync(targetDir);
  }

  // Copy template to target directory
  console.log(`\n\x1b[36m⏳ Scaffolding project in ${targetDir}...\x1b[0m\n`);
  fs.copySync(TEMPLATE_DIR, targetDir);

  // Rename files (e.g., _gitignore -> .gitignore)
  renameFiles(targetDir);

  // Replace placeholders
  replacePlaceholders(targetDir, packageName);

  // Install dependencies
  console.log("\x1b[36m⏳ Installing dependencies...\x1b[0m\n");
  try {
    execSync("npm install", {
      cwd: targetDir,
      stdio: "inherit",
    });
  } catch {
    console.log(
      '\n\x1b[33m⚠  Failed to install dependencies. You can try running "npm install" manually.\x1b[0m',
    );
  }

  // Print success message
  console.log("");
  console.log("\x1b[32m✅ Project created successfully!\x1b[0m");
  console.log("");
  console.log("  Next steps:");
  console.log("");
  console.log(`  \x1b[36mcd ${projectName}\x1b[0m`);
  console.log(
    "  \x1b[36mnpm run dev\x1b[0m        — Start development (frontend + backend)",
  );
  console.log("  \x1b[36mnpm run build\x1b[0m      — Build for production");
  console.log(
    "  \x1b[36mnpm run start\x1b[0m      — Start production server (single port)",
  );
  console.log("");
  console.log("  \x1b[90mFrontend:\x1b[0m  http://localhost:5173");
  console.log("  \x1b[90mBackend:\x1b[0m   http://localhost:3000");
  console.log("  \x1b[90mAPI:\x1b[0m       http://localhost:3000/api");
  console.log("");
}

function renameFiles(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(dir, entry.name);

    if (RENAME_MAP[entry.name]) {
      const destPath = path.join(dir, RENAME_MAP[entry.name]);
      fs.renameSync(srcPath, destPath);

      // If it's a directory, continue recursing into the renamed path
      if (entry.isDirectory()) {
        renameFiles(destPath);
      }
    } else if (entry.isDirectory()) {
      renameFiles(srcPath);
    }
  }
}

function replacePlaceholders(targetDir: string, packageName: string): void {
  for (const file of PLACEHOLDER_FILES) {
    const filePath = path.join(targetDir, file);

    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf-8");
      content = content.replaceAll("{{projectName}}", packageName);
      fs.writeFileSync(filePath, content, "utf-8");
    }
  }
}

try {
  await main();
} catch (err) {
  console.error("\x1b[31mError:\x1b[0m", err);
  process.exit(1);
}
