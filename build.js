import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { VALID_BROWSERS } from "./constants.js";

dotenv.config();

const __dirname = path.resolve();
const outDir = path.resolve(__dirname, "build");
const distDir = path.resolve(__dirname, "dist");

/**
 * @typedef {import("esbuild").BuildOptions} BuildOptions
 */

/**
 * Configuration for extension entrypoints
 * @type {Array<{entryPoint: string, outputName: string, buildOptions?: BuildOptions}>}
 */
const entries = [
  {
    entryPoint: "src/entrypoints/content.js",
    outputName: "content.js",
  },
  {
    entryPoint: "src/entrypoints/bootstrap.js",
    outputName: "bootstrap.js",
  },
  {
    entryPoint: "src/entrypoints/background.js",
    outputName: "background.js",
  },
];

/**
 * Throws an error if a required environment variable is missing
 * @param {string} name
 */
function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/**
 * Environment variable definitions
 * @type {Record<string, string>}
 */
const definitions = {
  "process.env.GOOGLE_DEVICE_CLIENT_ID": JSON.stringify(
    requireEnv("GOOGLE_DEVICE_CLIENT_ID"),
  ),
  "process.env.GOOGLE_DEVICE_CLIENT_SECRET": JSON.stringify(
    requireEnv("GOOGLE_DEVICE_CLIENT_SECRET"),
  ),
};

/** Parsed package.json */
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
);

/**
 * Converts a version string to a semver string
 *
 * @example
 *   - "0.1.0-beta.2" -> "0.1.0.2"
 *   - "0.1.0" -> "0.1.0"
 *
 * @param {string} version
 * @returns {string}
 */
function getManifestVersion(version) {
  const [baseVersion, prerelease] = version.split("-");
  if (!prerelease) return baseVersion;

  const buildNumber = Number(prerelease.split(".").pop());

  return Number.isInteger(buildNumber)
    ? `${baseVersion}.${buildNumber}`
    : baseVersion;
}

/** Fields to copy from package.json to manifest */
const baseFields = {
  name: pkg.displayName || pkg.name,
  version: getManifestVersion(pkg.version),
  author: pkg.author,
  description: pkg.description,
  homepage_url: pkg.homepage,
};

/**
 * Parse command line arguments starting with `--`
 * @returns {Record<string, string>}
 */
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

/**
 * @param {string} src - Path to the source file
 * @param {string} dest - Path to the destination file
 */
function copyFileSync(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/**
 * Merges a template manifest with `content-scripts.json` and the baseFields from `package.json`,
 * then writes the result to `destPath`
 * @param {string} templatePath
 * @param {string} destPath
 */
function createManifest(templatePath, destPath) {
  const template = JSON.parse(fs.readFileSync(templatePath, "utf8"));

  const scriptsPath = path.resolve(__dirname, `content-scripts.json`);
  const scripts = JSON.parse(fs.readFileSync(scriptsPath, "utf8"));

  const merged = {
    ...template,
    ...baseFields,
    content_scripts: scripts,
  };
  fs.writeFileSync(destPath, JSON.stringify(merged, null, 2));
}

/**
 * Builds the extension for the given browser
 * @param {string} targetBrowser - Browser as defined in `VALID_BROWSERS`
 * @param {boolean} isDev - Whether to build in development mode
 */
async function buildForBrowser(targetBrowser, isDev) {
  console.log(`\nBuilding for ${targetBrowser}...`);

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  for (const { entryPoint, outputName, buildOptions } of entries) {
    await esbuild.build({
      entryPoints: [path.resolve(__dirname, entryPoint)],
      outfile: path.join(outDir, outputName),
      bundle: true,
      format: "iife",
      sourcemap: true,
      minify: false,
      target: ["es2018"],
      define: {
        __BROWSER__: JSON.stringify(targetBrowser),
        "process.env.NODE_ENV": JSON.stringify(
          isDev ? "development" : "production",
        ),
        ...definitions,
      },
      ...buildOptions,
    });
  }

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

  for (const { outputName } of entries) {
    const outPath = path.join(outDir, outputName);

    if (fs.existsSync(outPath))
      copyFileSync(outPath, path.join(distPath, outputName));
    else throw new Error(`Output file not found: ${outPath}`);
  }

  createManifest(manifestSrc, manifestDest);

  console.log(`✅ Build complete for ${targetBrowser}. Output: ${distPath}`);
}

async function buildOnce() {
  const args = parseArgs();
  const isDev = args.dev || false;
  const browser = args.browser || "all";

  if (!VALID_BROWSERS.includes(browser)) {
    throw new Error(
      `Invalid browser: ${browser}. Valid options are: ${VALID_BROWSERS.join(
        ", ",
      )}`,
    );
  }

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
