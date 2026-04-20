import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { VALID_BROWSERS } from "./constants.js";

const __dirname = path.resolve();
const outDir = path.resolve(__dirname, "build");
const distDir = path.resolve(__dirname, "dist");
const entry = path.resolve(__dirname, "src/index.js");
const loaderEntry = path.resolve(__dirname, "src/loader/bootstrap/index.js");

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
);
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
      const [key, value] = arg.replace(/^--/, "").split("=");
      args[key] = value ?? true;
    }
  }
  return args;
}

const args = parseArgs();
const browser = args.browser || "all";

if (!VALID_BROWSERS.includes(browser)) {
  throw new Error(
    `Invalid browser: ${browser}. Valid options are: ${VALID_BROWSERS.join(
      ", ",
    )}`,
  );
}

function copyFileSync(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function createManifest(templatePath, destPath) {
  const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));
  const merged = {
    ...template,
    ...baseFields,
  };
  fs.writeFileSync(destPath, JSON.stringify(merged, null, 2));
}

async function buildForBrowser(targetBrowser, isDev) {
  console.log(`\nBuilding for ${targetBrowser}...`);

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  // main script on document_idle
  await esbuild.build({
    entryPoints: [entry],
    outfile: path.join(outDir, "content.js"),
    bundle: true,
    format: "iife",
    globalName: "AO3ReadTracker",
    sourcemap: true,
    minify: false,
    target: ["es2018"],
    define: {
      __BROWSER__: JSON.stringify(targetBrowser),
      "process.env.NODE_ENV": JSON.stringify(
        isDev ? "development" : "production",
      ),
    },
  });

  // loader to start at document_start
  await esbuild.build({
    entryPoints: [loaderEntry],
    outfile: path.join(outDir, "loader.js"),
    bundle: true,
    format: "iife",
    sourcemap: true,
    minify: false,
    target: ["es2018"],
  });

  const distPath = path.join(distDir, `${targetBrowser}`);

  const manifestSrc = path.resolve(
    __dirname,
    `templates/manifest.${targetBrowser}.json`,
  );
  const manifestDest = path.join(distPath, "manifest.json");

  if (!fs.existsSync(manifestSrc))
    throw new Error(
      `Manifest file for ${targetBrowser} not found: ${manifestSrc}`,
    );

  if (fs.existsSync(distPath))
    fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  copyFileSync(
    path.join(outDir, "content.js"),
    path.join(distPath, "content.js"),
  );
  copyFileSync(
    path.join(outDir, "loader.js"),
    path.join(distPath, "loader.js"),
  );
  createManifest(manifestSrc, manifestDest);

  console.log(`✅ Build complete for ${targetBrowser}. Output: ${distPath}`);
}

async function buildOnce() {
  const isDev = args.dev || false;
  console.log(`Starting build${isDev ? " in development mode" : ""}...`);

  if (browser === "all") {
    await buildForBrowser("chrome", isDev);
    await buildForBrowser("firefox", isDev);
  } else {
    await buildForBrowser(browser, isDev);
  }
}

buildOnce().catch((err) => {
  console.error(err);
  process.exit(1);
});
