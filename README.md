# Akash Master Tracker

A mobile-first, multi-tracker app built with vanilla HTML, CSS, and JavaScript. Each tracker is a self-contained module — easy to extend, theme, or migrate to a framework in the future.

## Trackers

| Tab | Description |
|-----|-------------|
| ✅ **Tasks** | To-do list with priority levels (Low / Medium / High), filters, and completion tracking |
| 💧 **Water** | Daily hydration tracker with a progress ring, quick-add buttons, and custom goal |
| 🍽️ **Food** | Calorie tracker per meal (Breakfast / Lunch / Dinner / Snack) with daily goal |
| 💪 **Fitness** | Workout logger with streak counter, weekly stats, and exercise type badges |
| ⚙️ **Custom** | Create any tracker — set a name, unit, emoji, and daily goal. Tap +/− to log progress |

## Features

- **Dark mobile-first UI** — optimized for 430px (iPhone-sized), inspired by modern app design
- **Persistent state** — all data saved to `localStorage`, survives page reloads
- **Date-aware** — water/food/fitness reset daily; streaks and history accumulate over time
- **Stats header** — live summary stats update per active tracker
- **Bottom-sheet modals** — smooth slide-up modals with context-sensitive FAB (+) button
- **Scalable architecture** — each tracker is an isolated IIFE module with its own storage key

## Architecture

```
app.js
├── UTILS          — shared helpers (localStorage, date, time)
├── ROUTER         — switchView(), nav events, FAB routing
├── MODAL SYSTEM   — openModal / closeModal
├── STATS HEADER   — renderStats() calls active tracker's getStats()
└── TRACKERS{}
    ├── tasks      — STORE: amt_tasks
    ├── water      — STORE: amt_water, amt_water_goal
    ├── food       — STORE: amt_food, amt_food_goal
    ├── fitness    — STORE: amt_fitness
    └── custom     — STORE: amt_custom
```

Each tracker module exposes:
- `render()` — redraws the view
- `getStats()` — returns `[{ val, lbl }]` for the header

## Getting Started

```bash
git clone https://github.com/AKASHNINJA/akash-master-tracker.git
cd akash-master-tracker
# Open index.html in any modern browser — no build step needed
```

Or with Node.js:
```bash
npx serve .
# Visit http://localhost:3000
```

## Adding a New Tracker

1. Add a `<section class="view" id="view-mytracker">` in `index.html`
2. Add a nav button `<button class="nav-btn" data-view="mytracker">` in the bottom nav
3. Add a modal in `index.html`
4. Register `TRACKERS.mytracker = (() => { ... return { render, getStats }; })();` in `app.js`
5. Add `APP_META.mytracker = { title: '...', statsId: '...' }` in the router section

## Tech Stack

- HTML5 · CSS3 (custom properties, grid, flexbox, keyframes)
- Vanilla JavaScript (IIFE modules, no dependencies)
- localStorage for persistence

## License

MIT
