# Bălți: Vitrina Timpului

> A full-stack interactive museum web app that brings the history of Bălți to life — virtual exhibit halls, timeline missions, quizzes, a memory game, a badge cabinet, and a REST API with JWT authentication.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20RO%20%7C%20RU-green)
![Deploy](https://img.shields.io/badge/Frontend-GitHub%20Pages-orange?logo=github)
![Deploy](https://img.shields.io/badge/API-Render.com-46E3B7?logo=render&logoColor=white)

---

## Architecture

```
lab6/
├── src/              React 18 SPA (Vite + TypeScript)
├── server/           Express REST API (Node.js + TypeScript)
├── public/           Static assets (favicon, .nojekyll, images)
├── .github/          GitHub Actions — Pages CI/CD
└── render.yaml       Render.com deployment manifest
```

The frontend and backend are developed together but deployed independently:

| Layer | Runtime | Deploy target |
|---|---|---|
| **Client** | Vite / React SPA | GitHub Pages |
| **API** | Node.js / Express | Render.com (free tier) |

---

## Client Features

| Feature | Description |
|---|---|
| **Virtual halls** | Curated exhibit rooms organized by theme and era |
| **Timeline mission** | Place events on an interactive timeline to earn points |
| **Quizzes** | Per-hall knowledge checks with instant feedback and scoring |
| **Memory game** | Match historical image pairs against the clock |
| **Badge cabinet** | Collect and display achievements — persisted in `localStorage` |
| **Kiosk mode** | Touch-TV mode with a QR code so visitors can open the app on their phones |
| **Light / Dark theme** | System-respecting, user-toggleable |
| **EN / RO / RU** | Full UI localization via i18next |

All client state lives in `localStorage` — no login required to explore the museum.

---

## API Features

| Feature | Details |
|---|---|
| **CRUD** | Halls, Exhibits, Historical Persons, Timeline Events |
| **JWT auth** | HS256 tokens issued by `GET /token` or `POST /token` |
| **RBAC** | `ADMIN`, `WRITER`, `VISITOR` roles with `READ` / `WRITE` / `DELETE` permissions |
| **Pagination** | `?limit=` & `?offset=` on all list endpoints |
| **Validation** | Hand-rolled DTOs; `400` on bad input |
| **Swagger UI** | Live API docs at `/api-docs`, raw spec at `/api-docs.json` |
| **Integration tests** | Vitest + Supertest covering the full permission matrix |
| **In-memory store** | Seeded on startup; no database required |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18

### Install

```bash
npm install             # frontend deps
npm install --prefix server   # backend deps
```

### Run both together

```bash
npm run dev:all
```

This starts the **Vite dev server** on `http://localhost:5173` and the **Express API** on `http://localhost:3001` in parallel.

Or run them separately:

```bash
npm run dev        # frontend only
npm run dev:api    # backend only
```

### Environment variables

Copy the example files and fill in the values:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Each file is self-documenting — see [`.env.example`](./.env.example) for the frontend variables and [`server/.env.example`](./server/.env.example) for the backend variables.

---

## API Reference

**Base URL (dev):** `http://localhost:3001`

### Auth

```
GET  /token?role=VISITOR&permissions=READ        Issue a JWT (query params)
POST /token   { role, permissions }              Issue a JWT (JSON body)
```

Attach the token to every protected request:
```
Authorization: Bearer <token>
```

### Museum Endpoints

All endpoints require `Authorization: Bearer <token>`.  
Write/delete operations also require the corresponding permission in the token claims.

| Method | Path | Permission | Description |
|---|---|---|---|
| `GET` | `/api/halls` | `READ` | List halls (paginated) |
| `POST` | `/api/halls` | `WRITE` | Create a hall |
| `GET` | `/api/halls/:id` | `READ` | Get a hall |
| `PUT` | `/api/halls/:id` | `WRITE` | Update a hall |
| `DELETE` | `/api/halls/:id` | `DELETE` | Delete a hall |
| `GET` | `/api/exhibits` | `READ` | List exhibits — filter by `hallId`, `era`, `category` |
| `POST` | `/api/exhibits` | `WRITE` | Create an exhibit |
| `GET` | `/api/exhibits/:id` | `READ` | Get an exhibit |
| `PUT` | `/api/exhibits/:id` | `WRITE` | Update an exhibit |
| `DELETE` | `/api/exhibits/:id` | `DELETE` | Delete an exhibit |
| `GET` | `/api/historical-people` | `READ` | List persons (paginated) |
| `POST` | `/api/historical-people` | `WRITE` | Create a person |
| `GET` | `/api/historical-people/:id` | `READ` | Get a person |
| `PUT` | `/api/historical-people/:id` | `WRITE` | Update a person |
| `DELETE` | `/api/historical-people/:id` | `DELETE` | Delete a person |
| `GET` | `/api/timeline-events` | `READ` | List events sorted by year |
| `POST` | `/api/timeline-events` | `WRITE` | Create an event |
| `GET` | `/api/timeline-events/:id` | `READ` | Get an event |
| `PUT` | `/api/timeline-events/:id` | `WRITE` | Update an event |
| `DELETE` | `/api/timeline-events/:id` | `DELETE` | Delete an event |

### Paginated response shape

```json
{
  "data": [ ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

### Health check

```
GET /health     → 200 OK  (no auth)
```

### Swagger UI

```
GET /api-docs       Live interactive docs
GET /api-docs.json  Raw OpenAPI 3.0 spec
```

---

## Testing

```bash
npm run test:api    # Vitest + Supertest integration tests (runs inside server/)
```

Tests cover the full CRUD flow and the RBAC permission matrix.

---

## Builds

### Local production check

```bash
npm run build      # export-spec → tsc → vite build
npm run preview    # serve dist/ at http://localhost:4173
```

### GitHub Pages (frontend)

Set `VITE_BASE_URL` to `/<repository-name>/` before building.

**PowerShell**
```powershell
$env:VITE_BASE_URL = '/lab6/'
npm run build
npm run preview
```

**cmd.exe**
```bat
set VITE_BASE_URL=/lab6/
npm run build
npm run preview
```

`BrowserRouter` reads the same base as Vite's `base` — see [`src/app/AppRouter.tsx`](./src/app/AppRouter.tsx).

### Render.com (API)

```bash
npm run build:render   # server build + Vite build (skips export-spec)
```

The `render.yaml` manifest at the repo root configures the Node.js web service automatically.

---

## Deployment

### Frontend → GitHub Pages

The included workflow ([`.github/workflows/pages.yml`](./.github/workflows/pages.yml)) triggers on every push to `main`:

1. Installs deps for both frontend and backend
2. Runs `npm run build` (which exports the OpenAPI spec, type-checks, and builds the Vite bundle)
3. Sets `VITE_BASE_URL` from the repository name
4. Deploys `dist/` to GitHub Pages

Enable in **Settings → Pages → Source: GitHub Actions**.  
[`public/.nojekyll`](./public/.nojekyll) disables Jekyll so asset paths resolve correctly.

### API → Render.com

The [`render.yaml`](./render.yaml) manifest provisions a free-tier Node.js web service:

- **Build command:** `npm ci && npm ci --prefix server && npm run build:render`
- **Start command:** `node server/dist/index.js`
- **Health check:** `GET /health`

Configure the required environment variables in the Render dashboard — refer to [`server/.env.example`](./server/.env.example) for the full list.

---

## Kiosk Mode (Touch TV)

Append `?kiosk=1` to the URL on first load:

- Persists the kiosk flag in `localStorage`
- Hides the badge cabinet from the nav
- Redirects `/cabinet` to the halls index
- Shows a **QR code** so visitors can open the same URL on their own device

Exit kiosk mode with `?kiosk=0` (also accepts `false`, `no`, `off`).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server (frontend only) |
| `npm run dev:api` | Express dev server (backend only) |
| `npm run dev:all` | Both in parallel via `concurrently` |
| `npm run build` | export-spec → tsc → Vite production build |
| `npm run build:render` | Server build + Vite build (for Render.com) |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint (frontend) |
| `npm run lint:api` | ESLint (backend) |
| `npm run test:api` | Vitest integration tests (backend) |

