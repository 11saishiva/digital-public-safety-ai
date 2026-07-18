# Digital Public Safety AI Platform — Frontend

React 19 + TypeScript + Vite frontend for the Digital Public Safety AI Platform, built against the
existing FastAPI backend (counterfeit currency detection + scam message detection).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Axios · React Query (TanStack) ·
React Hook Form · lucide-react

## Getting started

```bash
npm install
cp .env.example .env      # point at your backend if not localhost:8000
npm run dev
```

The app expects the backend at `http://localhost:8000/api/v1` by default (see `.env.example`).
Swagger docs: `http://localhost:8000/docs`.

## Project structure

```
src/
  api/          axios client + typed API functions (counterfeit, scam)
  components/   reusable UI library (Button, Input, Card, Modal, Pagination, etc.)
  context/      ToastContext (global toast notifications)
  hooks/        React Query hooks per module (useCounterfeit, useScam)
  layouts/      MainLayout (navbar + footer shell)
  pages/        Home, CounterfeitDetection, ScamDetection, Reports, ReportDetail, NotFound
  routes/       AppRoutes (React Router route table)
  types/        TypeScript types matching backend response models
  utils/        formatting helpers (dates, confidence %, durations)
```

## Notes

- All business/AI logic lives in the backend; this app only collects input, calls the API, and
  renders results.
- Loading, empty, and error states are handled consistently across both detection modules and the
  Reports list via shared components (`Loader`, `EmptyState`, `ErrorState`, `Skeleton`).
- Reports support tabs (Counterfeit / Scam), search, pagination, view detail, and delete with a
  confirmation dialog.
- Nice-to-haves implemented: toast notifications, copy-prediction-to-clipboard on the report detail
  page, and responsive layout down to 320px.
- Nice-to-haves left as extension points (backend endpoints not specified in the spec): dark mode,
  PDF export of report detail, sort-by controls on Reports, and a "recent predictions" home widget.

## Design

Visual direction: professional / government / cybersecurity, minimal. Space Grotesk for headings,
Inter for body text, JetBrains Mono for data readouts (confidence, timestamps, model version).
Signature detail: corner-bracket "scanner reticle" framing on image previews and result cards,
echoing a security-scan viewfinder.
