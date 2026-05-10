import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { syncClerkUser } from "../controllers/authController.js";

export function createAuthRouter() {
  const router = Router();

  /** Sync the currently signed-in Clerk user into the Supabase users table.
   *  Frontend should call this once after every login/signup. */
  router.post("/auth/sync", requireAuth, syncClerkUser);

  return router;
}
