# To-Do List Life Dashboard

A single-page productivity dashboard built with vanilla HTML, CSS, and JavaScript for the Coding Camp assignment. Runs entirely in the browser — no build step, no frameworks, no backend.

## Features

### Core Features
- **Real-time clock & date** — displays current time (HH:MM, 24-hour) and date (Weekday, Day Month Year), updating every second
- **Time-based greeting** — shows "Good Morning", "Good Afternoon", or "Good Evening" based on the current hour
- **Focus Timer** — 25-minute Pomodoro countdown with Start, Stop, and Reset controls; preserves remaining time on Stop so you can resume
- **Task Manager** — full CRUD: add, inline-edit, complete/uncomplete, and delete tasks; persists across page refresh
- **Quick Links** — save and open favorite URLs (http/https only) in a new tab; persists across page refresh

### Optional Challenges (all three implemented)
1. **Light/Dark Mode** — toggle between dark and light themes via the ☀/🌙 button in the header; preference saved to localStorage and restored on next load with no flash
2. **Prevent Duplicate Tasks** — adding or editing a task to match an existing task (case-insensitive, trimmed) is rejected with an inline error message
3. **Sort Tasks** — sort the task list by Active First (default), Completed First, or Alphabetical (A–Z); applies on every render without mutating stored data

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic elements, ARIA labels) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Logic | Vanilla JavaScript (ES2020, no frameworks) |
| Persistence | Browser `localStorage` API |

## Folder Structure

```
CodingCamp-16November26-fai/
├── index.html          # Single HTML entry point
├── css/
│   └── style.css       # All styles: theme variables, layout, components
├── js/
│   └── script.js       # All logic: services, managers, initialization
└── .kiro/
    └── specs/
        └── todo-list-life-dashboard/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## Running Locally

No installation or build step required. Open `index.html` directly in any modern browser:

```
# Option 1 — file protocol (double-click or drag into browser)
open index.html

# Option 2 — local server (avoids any file:// restrictions)
npx serve .
# or
python3 -m http.server 8080
```

Tested in Chrome, Firefox, Edge, and Safari.

## Local Storage Usage

The app stores three keys in `localStorage`:

| Key | Type | Description |
|-----|------|-------------|
| `"theme"` | `"dark"` \| `"light"` | Saved theme preference; defaults to `"dark"` if absent |
| `"tasks"` | JSON array | Array of Task objects `{ id, text, completed, createdAt }` |
| `"quickLinks"` | JSON array | Array of Link objects `{ id, name, url, createdAt }` |

Data is written synchronously on every mutation. If `localStorage` is unavailable or full, a brief warning banner appears at the bottom of the screen and the app continues working for the current session. The Focus Timer is intentionally not persisted — it always resets to 25:00 on page load.
