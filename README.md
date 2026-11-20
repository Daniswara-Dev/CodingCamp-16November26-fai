# To-Do List Life Dashboard

A single-page productivity dashboard built with vanilla HTML, CSS, and JavaScript for the Coding Camp assignment. Runs entirely in the browser — no build step, no frameworks, no backend.

## Features

### Core Features
- **Real-time clock & date** — displays current time (HH:MM, 24-hour) and date (Weekday, Day Month Year), updating every second
- **Time-based greeting** — shows "Good Morning", "Good Afternoon", or "Good Evening" based on the current hour
- **Focus Timer** — adjustable Pomodoro countdown (25-minute default, 1–120 minutes) with Start, Stop, and Reset controls; preserves remaining time on Stop and resets to the selected duration
- **Task Manager** — full CRUD: add, inline-edit, complete/uncomplete, and delete tasks; persists across page refresh
- **Quick Links** — save and open favorite URLs (http/https only) in a new tab; persists across page refresh

### Optional Challenges (all five implemented)
1. **Light/Dark Mode** — toggle between dark and light themes via the ☀/🌙 button in the header; preference saved to localStorage and restored on next load with no flash
2. **Prevent Duplicate Tasks** — adding or editing a task to match an existing task (case-insensitive, trimmed) is rejected with an inline error message
3. **Sort Tasks** — sort the task list by Active First (default), Completed First, or Alphabetical (A–Z); applies on every render without mutating stored data
4. **Custom Name in Greeting** — click ✏ Name to set a personal name inline; header shows "Welcome, [name]!" and persists across refreshes; empty names rejected
5. **Change Pomodoro Time** — set any duration from 1–120 minutes via the timer card; persisted to localStorage; blocked while timer is running; reset always returns to the selected duration

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
            ├── .config.kiro
            ├── requirements.md
            ├── design.md
            ├── tasks.md
            └── tasks.meta.json
```

## Running Locally

No installation or build step is required. From the project root, start Python's built-in static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in Firefox or another modern browser. Using a local server provides a consistent browser origin for `localStorage`.

The application is designed for compatibility with modern browsers, including Chrome, Firefox, Edge, and Safari.

## Local Storage Usage

The app stores five keys in `localStorage`:

| Key | Type | Description |
|-----|------|-------------|
| `"theme"` | `"dark"` \| `"light"` | Saved theme preference; defaults to `"dark"` if absent |
| `"userName"` | string | Custom display name; absent means no name configured ("Welcome!" shown) |
| `"pomodoroDuration"` | integer string | Pomodoro duration in minutes (1–120); absent defaults to 25 |
| `"tasks"` | JSON array | Array of Task objects `{ id, text, completed, createdAt }` |
| `"quickLinks"` | JSON array | Array of Link objects `{ id, name, url, createdAt }` |

Data is written synchronously on every mutation. If `localStorage` is unavailable or full, a brief warning banner appears at the bottom of the screen and the app continues working for the current session. The active Focus Timer countdown is intentionally not persisted. On page load, the timer starts idle at the saved Pomodoro duration (25 minutes by default), rather than restoring an in-progress session.
