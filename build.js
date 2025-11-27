import { build as viteBuild } from "vite";
import fs from "fs";
import path from "path";
import { VALID_BROWSERS } from "./constants.js";

const __dirname = path.resolve();
const distDir = path.resolve(__dirname, "dist");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const baseFields = {
  name: pkg.displayName || pkg.name,
  version: pkg.version,
  author: pkg.author,
  description: pkg.description,
  homepage_url: pkg.homepage,
};

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--")) {
      const [k, v] = arg.replace(/^--/, "").split("=");
      args[k] = v ?? true;
    }
  }
  return args;
}

function mergeManifest(templatePath, destPath) {
  const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  const merged = { ...template, ...baseFields };
  merged.manifest_version = template.manifest_version;
  fs.writeFileSync(destPath, JSON.stringify(merged, null, 2));
}

async function buildForBrowser(browser, isDev) {
  console.log(`\n📦 Building for ${browser}...`);

  // 1. Build with Vite
  await viteBuild(
    {
      mode: isDev ? "development" : "production",
      define: {
        __BROWSER__: JSON.stringify(browser),
        __DEV__: JSON.stringify(isDev),
      },
      envDir: ".",
      // send the browser to vite.config.js
      // (important!)
      build: {
        outDir: `build/${browser}`,
      },
      // pass to config via env
      // Vite injects TARGET_BROWSER for us
      // we don't need to manually override the config file
    },
    {
      env: { TARGET_BROWSER: browser },
    }
  );

  // 2. Prepare dist folder
  const buildPath = path.join(__dirname, "build", browser);
  const distPath = path.join(distDir, browser);

  if (fs.existsSync(distPath))
    fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  // 3. Copy content.js
  fs.copyFileSync(
    path.join(buildPath, "content.js"),
    path.join(distPath, "content.js")
  );

  // 4. Merge manifest
  const manifestSrc = path.resolve(`templates/manifest.${browser}.json`);
  if (!fs.existsSync(manifestSrc))
    throw new Error(`Missing manifest template for ${browser}`);

  mergeManifest(manifestSrc, path.join(distPath, "manifest.json"));

  console.log(`✅ Done → dist/${browser}`);
}

async function main() {
  const args = parseArgs();
  const browser = args.browser || "all";
  const isDev = Boolean(args.dev);

  if (browser === "all") {
    for (const b of VALID_BROWSERS) {
      await buildForBrowser(b, isDev);
    }
  } else {
    if (!VALID_BROWSERS.includes(browser))
      throw new Error(`Invalid browser: ${browser}`);

    await buildForBrowser(browser, isDev);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
