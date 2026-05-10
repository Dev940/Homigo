import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";
import { requireAuth } from "./middleware/auth.js";
import { createAuthRouter } from "./routes/authRoutes.js";
import { createDomainRouter } from "./routes/domainRoutes.js";
import { createCrudRouter } from "./routes/tableRoutes.js";
import { registerSwagger } from "./docs/swagger.js";
import { handleClerkWebhook } from "./controllers/authController.js";

export function createApp() {
  const app = express();

  const allowedOrigins = (env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const corsOptions: cors.CorsOptions = {
    credentials: true,
    origin(origin, callback) {
      // Non-browser clients (curl/Postman) often send no Origin.
      if (!origin) return callback(null, true);

      // If no origins are configured, fail closed for browsers.
      if (allowedOrigins.length === 0) return callback(new Error("CORS: no allowed origins configured"));

      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin not allowed: ${origin}`));
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  // Clerk webhook must receive the raw body for signature verification —
  // mount it before express.json() with its own raw body parser.
  app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), handleClerkWebhook);

  app.use(express.json({ limit: "5mb" }));
  // Always mount clerkMiddleware so getAuth() can read the request context on
  // every route. When CLERK_SECRET_KEY is absent it runs in unauthenticated
  // passthrough mode; requireAuth below handles enforcement.
  app.use(
    clerkMiddleware(
      env.CLERK_SECRET_KEY
        ? {
            secretKey: env.CLERK_SECRET_KEY,
            publishableKey: env.CLERK_PUBLISHABLE_KEY,
          }
        : {}
    )
  );

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "homigo-backend" });
  });
  registerSwagger(app);

  app.use(requireAuth);
  app.use("/api", createAuthRouter());
  app.use("/api", createDomainRouter());
  app.use("/api", createCrudRouter());

  app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  return app;
}