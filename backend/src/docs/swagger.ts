import { existsSync } from "node:fs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";
import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

/** Use POSIX paths so glob works on Windows. */
function posix(p: string) {
  return p.split(path.sep).join("/");
}

// OpenAPI is assembled from:
// 1. JSON fragments under src/docs/openapi (recursive *.json).
// 2. JSDoc @openapi in src/controllers and src/routes (also dist when compiled).
// 3. Do not list paths in this file — add paths-*.json or annotate .ts files.
function resolveDocsDir(): string {
  const beside = path.join(path.dirname(fileURLToPath(import.meta.url)), "openapi");
  if (existsSync(beside)) return beside;
  const fallback = path.join(process.cwd(), "src", "docs", "openapi");
  if (existsSync(fallback)) return fallback;
  return beside;
}

function resolveCodeRoot(): string {
  const docsFile = path.dirname(fileURLToPath(import.meta.url));
  // .../src/docs or .../dist/docs → code root is parent
  return path.join(docsFile, "..");
}

function buildApiGlobs(): string[] {
  const openapiDir = resolveDocsDir();
  const codeRoot = resolveCodeRoot();
  const globs: string[] = [];

  if (existsSync(openapiDir)) {
    // We load JSON fragments manually (see `loadOpenApiFragments()`).
    // Keep glob only for possible JSDoc `@openapi` blocks in those files (rare).
    globs.push(posix(path.join(openapiDir, "**", "*.json")));
  }

  const controllers = path.join(codeRoot, "controllers");
  if (existsSync(controllers)) {
    globs.push(posix(path.join(controllers, "**", "*.ts")));
    globs.push(posix(path.join(controllers, "**", "*.js")));
  }

  const routes = path.join(codeRoot, "routes");
  if (existsSync(routes)) {
    globs.push(posix(path.join(routes, "**", "*.ts")));
    globs.push(posix(path.join(routes, "**", "*.js")));
  }

  return globs;
}

const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "Homigo Backend API",
    version: "1.0.0",
    description:
      "Merged from `src/docs/openapi/*.json` and `@openapi` JSDoc in `controllers/` and `routes/`. Add `paths-*.json` or annotate handlers to extend docs.",
  },
  servers: [{ url: "http://localhost:4000", description: "Local" }],
  tags: [
    { name: "System", description: "Health" },
    { name: "Users", description: "Users & onboarding" },
    { name: "Onboarding", description: "Profile onboarding" },
    { name: "Owners", description: "Owner KYC" },
    { name: "Properties", description: "Listings" },
    { name: "CRUD", description: "Generic table API" },
    { name: "Domain", description: "Other domain routes (add JSON fragments or JSDoc)" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target: any, source: any): any {
  if (Array.isArray(target) && Array.isArray(source)) return [...target, ...source];
  if (isRecord(target) && isRecord(source)) {
    const out: Record<string, any> = { ...target };
    for (const [k, v] of Object.entries(source)) {
      out[k] = k in out ? deepMerge(out[k], v) : v;
    }
    return out;
  }
  // For primitives (and mixed types), prefer source.
  return source;
}

function listJsonFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsonFilesRecursive(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) out.push(full);
  }
  return out;
}

/**
 * Loads JSON OpenAPI fragments like:
 * - `{ "paths": { ... } }`
 * - `{ "components": { ... } }`
 *
 * This is needed because `swagger-jsdoc` does not reliably merge arbitrary JSON fragments into `paths`.
 */
function loadOpenApiFragments(): Record<string, any> {
  const openapiDir = resolveDocsDir();
  if (!existsSync(openapiDir)) return {};

  const files = listJsonFilesRecursive(openapiDir).sort();
  let merged: Record<string, any> = {};
  for (const file of files) {
    try {
      const raw = fs.readFileSync(file, "utf8");
      const json = JSON.parse(raw);
      merged = deepMerge(merged, json);
    } catch {
      // Ignore invalid JSON fragments so docs don't crash the server.
      // (Better to show partial docs than none.)
    }
  }
  return merged;
}

function buildSwaggerSpec() {
  const jsdocSpec = swaggerJSDoc({
    definition: swaggerDefinition,
    apis: buildApiGlobs(),
  });

  // Merge JSON fragments (paths/components/etc) into the final spec.
  const fragmentSpec = loadOpenApiFragments();
  return deepMerge(jsdocSpec, fragmentSpec);
}

const swaggerSpec = buildSwaggerSpec();

export function registerSwagger(app: Express) {
  app.get("/docs.json", (_req, res) => {
    if (process.env.SWAGGER_RELOAD === "1") {
      return res.json(buildSwaggerSpec());
    }
    res.json(swaggerSpec);
  });

  // Keep both routes so links don't break:
  // - `/api-docs` is what the app currently advertises/uses
  // - `/docs` is convenient for local browsing
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
