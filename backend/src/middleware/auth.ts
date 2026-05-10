import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

const publicRoutes = [
  { method: "GET", pattern: /^\/health$/ },
  { method: "POST", pattern: /^\/api\/properties\/search$/ },
  { method: "GET", pattern: /^\/api\/properties\/search$/ },
  { method: "GET", pattern: /^\/api\/properties\/[^/]+$/ },
];

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!env.CLERK_SECRET_KEY) return next();
  if (publicRoutes.some((route) => route.method === req.method && route.pattern.test(req.path))) return next();

  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: "Unauthorized. Sign in with Clerk and send an Authorization Bearer token." });
  }

  return next();
}
