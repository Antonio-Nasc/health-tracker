# HealthTracker

A modern fitness activity tracker built with **Next.js + TypeScript**, using a modular architecture inspired by **Feature-Sliced Design (FSD)**.

Track workouts, monitor calories/time/distance, filter by date and category, and visualize weekly/monthly progress with interactive charts.

## Highlights

- Modular architecture inspired by Feature-Sliced Design (FSD)
- Activity CRUD (create, edit, delete)
- Category and date filtering
- Weekly and monthly analytics charts
- Dark mode toggle
- Toast/modal feedback for user actions
- Local persistence with IndexedDB
- Async caching and mutations with TanStack Query
- Global UI state with Zustand
- Responsive UI with Tailwind CSS
- Unit tests for store, helpers, and hooks

## Tech Stack

- **Framework:** Next.js (Pages Router)
- **Language:** TypeScript (strict mode)
- **State Management:** Zustand
- **Data Fetching/Cache:** TanStack Query
- **Local Storage:** IndexedDB (`idb`)
- **Charts:** Victory
- **Styling:** Tailwind CSS
- **Testing:** Jest + React Testing Library
- **Code Quality:** ESLint + Prettier + Husky

## Architecture (FSD-Inspired)

```text
src/
├─ app/
│  ├─ providers/          # Global providers (Query, theme, toast layer)
│  └─ store/              # Zustand global store
├─ entities/
│  └─ activity/           # Core domain types + persistence layer
├─ features/
│  └─ activity/           # Feature hooks, business logic, UI blocks
├─ pages/
│  ├─ index.tsx           # Dashboard
│  ├─ activities/[id].tsx # Activity details + edit
│  └─ stats.tsx           # Weekly/monthly statistics
├─ shared/
│  ├─ ui/                 # Reusable UI components (Button, Input, Modal, Toast)
│  └─ lib/                # Generic utilities (date/format helpers)
└─ styles/
   └─ globals.css
```

## Rendering Strategy

- **Dashboard (`/`)**: SSG + ISR (`revalidate: 300`)
- **Stats (`/stats`)**: SSG + ISR (`revalidate: 300`)
- **Activity Detail (`/activities/[id]`)**: SSR

> Persistent activity data is client-side (IndexedDB), while page shells follow Next.js rendering best practices.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/HealthTracker.git
cd HealthTracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Start local development server
npm run build        # Production build
npm run start        # Run production server
npm run lint         # Lint code
npm run typecheck    # TypeScript checks
npm run test         # Run unit tests
npm run test:watch   # Watch mode tests
npm run format       # Format code with Prettier
```

## Testing

This project includes unit tests for:

- Zustand store behavior
- Activity business logic helpers
- TanStack Query activity hooks

Run:

```bash
npm run test
```

## Quality Gates

- Strict TypeScript settings
- ESLint + Prettier setup
- Husky pre-commit hook running lint and tests

## Roadmap

- Add authentication and cloud sync
- Add goals and streaks
- Add export/import (CSV/JSON)
- Add E2E coverage with Playwright

## License

This project is licensed under the MIT License.
