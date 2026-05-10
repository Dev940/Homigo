# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Homigo** is a roommate and accommodation matching platform with two user roles: **seekers** (find roommates/housing) and **owners** (list properties). It is a monorepo with a separate `backend/` and `frontend/`.

---

## Commands

### Backend (`backend/`)
```bash
npm run dev      # tsx watch mode on port 4000
npm run build    # tsc + copy-openapi.mjs script
npm run start    # node dist/server.js (production)
```

### Frontend (`frontend/`)
```bash
npm run dev      # Vite dev server on port 5173
npm run build    # tsc -b && vite build
npm run preview  # Preview production build
```

No test runner is configured in either package.

---

## Environment Variables

### Backend (`.env` in `backend/`)
```
PORT=4000
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
FRONTEND_ORIGIN=http://localhost:5173
CLERK_SECRET_KEY=          # optional — auth is skipped if absent
```
Environment is validated at startup via Zod in `backend/src/config/env.ts`. The server will not start if required vars are missing.

### Frontend (`.env.local` in `frontend/`)
```
VITE_API_BASE_URL=http://localhost:4000/api   # defaults to this if unset
VITE_SUPABASE_URL=...                          # optional direct DB access
VITE_SUPABASE_ANON_KEY=...
VITE_CLERK_PUBLISHABLE_KEY=...                # optional
VITE_DEMO_USER_ID=1                           # fallback user for dev
```

---

## Architecture

### Backend

**Entry point**: `backend/src/server.ts` — creates the HTTP server with Socket.io attached.  
**App setup**: `backend/src/app.ts` — Express middleware, CORS (to `FRONTEND_ORIGIN`), Clerk middleware (optional), route mounting.

Two route families are mounted:
- **Domain routes** (`routes/domainRoutes.ts`): Business logic endpoints — onboarding, property search/management, conversations, messages, dashboard, recommendations.
- **CRUD routes** (`routes/tableRoutes.ts`): Generic list/get/create/update/delete over 19+ Supabase tables, handled by `controllers/tableController.ts`.

Controllers:
- `tableController.ts` — generic CRUD with pagination, filtering, and full-text search
- `OnbordingController.ts` — seeker and owner onboarding flows
- `ownerPropertyController.ts` — property listing management
- `chatController.ts` — conversation and message handling

**Auth middleware** (`middleware/auth.ts`): Clerk JWT validation. When `CLERK_SECRET_KEY` is absent, auth is bypassed (useful for local dev without Clerk).

**WebSocket** (`realtime/socket.ts`): Socket.io on the same HTTP server. Clients join a `user:{userId}` room; the server validates `user_id` from the handshake.

**API docs**: Swagger UI served at `/api-docs`, spec built from JSDoc annotations and `src/docs/openapi/` JSON files.

### Frontend

**Entry point**: `frontend/src/main.tsx` → `App.tsx`.

**Routing**: Hash-based (`#/page-name`) — no React Router; `App.tsx` maps a known page set to components.

**Auth**: `components/auth/AuthContext.tsx` provides `useHomigoAuth()`. An optional `AuthBridge` component syncs Clerk session into app state. Protected routes are wrapped with `ProtectedRoute`.

**API client**: `lib/api.ts` — thin fetch wrapper that attaches a Bearer token when the user is signed in. All backend calls go through this.

**Supabase client** (`lib/supabase.ts`): Available for direct DB access when env vars are set.

**Styling**: Tailwind CSS 3.4 with a custom Material 3 palette, Manrope (headings) and Inter (body) fonts, defined in `tailwind.config.ts`.

### Database

Schema lives in `backend/supabase/schema.sql`. Key entities:

| Category | Tables |
|----------|--------|
| Core | `users`, `seeker_profiles`, `owner_profiles`, `properties`, `media` |
| Matching | `roommate_matches`, `saved_items`, `inquiries` |
| Messaging | `conversations`, `messages` |
| Supporting | `seeker_preferred_locations`, `lifestyles`, `property_amenities`, `property_photos`, `property_views`, `notifications`, `kyc_documents` |

Enums: `user_role` (seeker/owner/both), `property_type_enum`, `message_type_enum`, `match_type_enum`, `gender_type`, `media_type`.

Additional RPC/view definitions are in `backend/supabase/schema_extensions_api.sql`.

---

## Key File Locations

| Purpose | Path |
|---------|------|
| Backend entry | `backend/src/server.ts` |
| Express app config | `backend/src/app.ts` |
| Env validation | `backend/src/config/env.ts` |
| Supabase client (backend) | `backend/src/config/supabase.ts` |
| Domain routes | `backend/src/routes/domainRoutes.ts` |
| Generic CRUD routes | `backend/src/routes/tableRoutes.ts` |
| Auth middleware | `backend/src/middleware/auth.ts` |
| WebSocket server | `backend/src/realtime/socket.ts` |
| Database schema | `backend/supabase/schema.sql` |
| Frontend entry | `frontend/src/main.tsx` |
| App router | `frontend/src/App.tsx` |
| Auth context | `frontend/src/components/auth/AuthContext.tsx` |
| API client | `frontend/src/lib/api.ts` |
| Shared types | `frontend/src/lib/types.ts` |
