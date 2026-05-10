import type { Request, Response } from "express";
import { supabase } from "../config/supabase.js";
import { sendError } from "../utils/http.js";

export type TableConfig = {
  table: string;
  primaryKey: string;
  searchable?: string[];
  defaultOrder?: string;
  trackUpdatedAt?: boolean;
};

const PAGE_SIZE = 20;

export function createTableController(config: TableConfig) {
  return {
    async list(req: Request, res: Response) {
      try {
        const page = Math.max(Number(req.query.page ?? 1), 1);
        const limit = Math.min(Math.max(Number(req.query.limit ?? PAGE_SIZE), 1), 100);
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        let query = supabase.from(config.table).select("*", { count: "exact" }).range(from, to);

        if (config.defaultOrder) query = query.order(config.defaultOrder, { ascending: false });

        for (const [key, value] of Object.entries(req.query)) {
          if (["page", "limit", "q"].includes(key) || value === undefined) continue;
          query = query.eq(key, value);
        }

        if (req.query.q && config.searchable?.length) {
          const q = String(req.query.q).replace(/[%(),]/g, "");
          query = query.or(config.searchable.map((column) => `${column}.ilike.%${q}%`).join(","));
        }

        const { data, error, count } = await query;
        if (error) throw error;
        res.json({ data, count, page, limit });
      } catch (error) {
        sendError(res, error);
      }
    },

    async get(req: Request, res: Response) {
      try {
        const { data, error } = await supabase.from(config.table).select("*").eq(config.primaryKey, req.params.id).single();
        if (error) throw error;
        res.json({ data });
      } catch (error) {
        sendError(res, error);
      }
    },

    async create(req: Request, res: Response) {
      try {
        const { data, error } = await supabase.from(config.table).insert(req.body).select("*").single();
        if (error) throw error;
        res.status(201).json({ data });
      } catch (error) {
        sendError(res, error);
      }
    },

    async update(req: Request, res: Response) {
      try {
        const payload = config.trackUpdatedAt ? { ...req.body, updated_at: new Date().toISOString() } : req.body;
        const { data, error } = await supabase.from(config.table).update(payload).eq(config.primaryKey, req.params.id).select("*").single();
        if (error) throw error;
        res.json({ data });
      } catch (error) {
        sendError(res, error);
      }
    },

    async remove(req: Request, res: Response) {
      try {
        const { error } = await supabase.from(config.table).delete().eq(config.primaryKey, req.params.id);
        if (error) throw error;
        res.status(204).send();
      } catch (error) {
        sendError(res, error);
      }
    },
  };
}
