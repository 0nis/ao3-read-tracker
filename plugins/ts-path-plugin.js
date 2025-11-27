// plugins/ts-path-plugin.js
import fs from "fs";
import path from "path";

export default {
  name: "ts-paths",
  setup(build) {
    const tsconfigPath = "./tsconfig.json";
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

    const baseUrl = path.resolve(
      path.dirname(tsconfigPath),
      tsconfig.compilerOptions?.baseUrl || "."
    );

    const paths = tsconfig.compilerOptions?.paths || {};

    // Normalize path aliases
    const aliasEntries = Object.entries(paths).map(([alias, targets]) => {
      const target = targets[0];

      const isWildcard = alias.endsWith("/*");
      const aliasPrefix = isWildcard
        ? alias.slice(0, -1) // keep "@utils/"
        : alias;

      const targetPrefix = isWildcard ? target.slice(0, -1) : target;

      return {
        aliasPrefix, // "@utils/" or "@data"
        isWildcard,
        targetBase: path.resolve(baseUrl, targetPrefix), // absolute target
      };
    });

    build.onResolve({ filter: /.*/ }, (args) => {
      const importPath = args.path.replace(/\\/g, "/");

      for (const { aliasPrefix, isWildcard, targetBase } of aliasEntries) {
        if (
          importPath === aliasPrefix ||
          (isWildcard && importPath.startsWith(aliasPrefix))
        ) {
          const remainder = isWildcard
            ? importPath.slice(aliasPrefix.length)
            : "";

          const resolvedAbs = path.join(targetBase, remainder);

          // Try file and directory variants
          const candidates = [
            resolvedAbs,
            resolvedAbs + ".ts",
            resolvedAbs + ".js",
            path.join(resolvedAbs, "index.ts"),
            path.join(resolvedAbs, "index.js"),
          ];

          for (const file of candidates) {
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
              // Convert absolute file path → relative import specifier
              const rel = path.relative(args.resolveDir, file);
              const finalPath = rel.startsWith(".") ? rel : "./" + rel;

              console.log(`[ts-paths] ${importPath} → ${finalPath}`);

              return { path: file };
            }
          }

          // Fail loudly
          return {
            errors: [
              {
                text: `[ts-paths] Failed to resolve alias "${importPath}" → base "${resolvedAbs}"`,
              },
            ],
          };
        }
      }

      return null;
    });
  },
};
