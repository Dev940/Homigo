import type { Response } from "express";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function sendError(res: Response, error: unknown) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error && typeof error === "object" && "message" in error) {
    return res.status(500).json({ error: String(error.message) });
  }

  return res.status(500).json({ error: "Unexpected server error" });
}
