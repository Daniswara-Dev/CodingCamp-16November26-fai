# Implementation Plan: To-Do List Life Dashboard

## Overview

Build a single-page productivity dashboard with vanilla HTML, CSS, and JavaScript. The implementation follows a strict dependency order: project scaffold → theme flash prevention → CSS foundation → utility/service layer → feature managers → validation UI → polish. Each step integrates into the files created by the previous step, leaving no orphaned code.

## Tasks

- [x] 1. Create project scaffold
  - Create `index.html` at the workspace root with correct HTML5 boilerplate, `<link>` to `css/style.css`, and `<script src="js/script.js">` before `</body>`
  - Create `css/style.css` as an empty file (populated in later tasks)
  - Create `js/script.js` as an empty file (populated in later tasks)
  - Verify folder structure matches Requirement 17: `index.html` at root, `css/style.css`, `js/script.js`
  - _Requirements: 11.1, 11.2, 11.3, 17.1, 17.2, 17.3_

- [x] 2. Add theme flash prevention and HTML structure
  - [x] 2.1 Add inline `<script>` in `<head>` of `index.html` that reads `localStorage.getItem('theme')` and calls `document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark')` before the browser paints
  - [x] 2.2 Add all semantic HTML markup to `index.html`: header (clock, date, greeting, theme toggle button), main grid (Focus Timer card and Task Manager card), Quick Links card — use `id` attributes that `js/script.js` will target
  - _Requirements: 14.1, 14.2, 14.3, 16.7, 16.8, 16.9_

- [x] 3. Implement CSS foundation
  - [x] 3.1 Write CSS custom properties on `:root` for the dark theme palette (`--bg`, `--card`, `--surface`, `--accent`, `--accent2`, `--text`, `--text-muted`, `--success`, `--danger`, `--border`) and override all of them under `[data-theme="light"]` with the light palette values from the design
  - [x] 3.2 Write global reset, base typography, card styles (rounded corners, border, background using CSS variables), and consistent component spacing
  - [x] 3.3 Write the two-column main grid layout (Focus Timer and Task Manager side by side) for desktop (≥768px) and single-column stacking for mobile (<768px) using a CSS media query
  - [x] 3.4 Add `transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease` globally so all cards, text, and borders animate on theme switch
  - _Requirements: 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 15.1, 15.2, 15.3, 15.4, 16.5, 16.10, 16.11, 16.13_

- [x] 4. Implement LocalStorageService and generateId
  - [x] 4.1 Write `LocalStorageService` in `js/script.js` with `getJSON(key)` (try/catch JSON.parse, returns null on error), `setJSON(key, value)` (try/catch setItem, shows brief user-visible warning and logs on QuotaExceededError or any storage error), `getRaw(key)`, `setRaw(key, value)` (try/catch, shows brief user-visible warning on failure), and `removeItem(key)`
  - [x] 4.2 Write `generateId()` utility that uses `crypto.randomUUID()` when available and falls back to `Date.now().toString() + Math.random().toString(36).slice(2)`
  - _Requirements: 8.4, 10.4, 11.4_

- [x] 5. Implement ThemeManager
  - [x] 5.1 Write `ThemeManager` with `init()` (reads `getRaw("theme")`, defaults to `"dark"`, sets `data-theme` on `<html>`, updates toggle button icon), `toggle()` (switches between `"dark"` and `"light"`, calls `setRaw("theme", theme)`, updates the toggle button icon to sun☀/moon🌙), and `getTheme()` returning `"dark" | "light"`
  - [x] 5.2 Wire the theme toggle button's click handler to `ThemeManager.toggle()` in the DOMContentLoaded initialization sequence
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.6, 16.7, 16.8, 16.9, 16.12_

- [x] 6. Implement GreetingDisplay
  - [x] 6.1 Write pure functions `formatTime(date)` returning `"HH:MM"` (24-hour, zero-padded hour and minute), `formatDate(date)` returning `"Weekday, Day Month Year"`, and `getGreeting(hour)` returning `"Good Morning"` for hours 0–11, `"Good Afternoon"` for 12–17, `"Good Evening"` for 18–23
  - [x] 6.2 Write `GreetingDisplay` with `tick()` (calls `new Date()`, updates the clock, date, and greeting DOM elements) and `init()` (calls `tick()` immediately, then `setInterval(tick, 1000)`)
  - [x] 6.3 Add `GreetingDisplay.init()` call to the DOMContentLoaded initialization sequence
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [x] 7. Implement FocusTimer
  - [x] 7.1 Write `FocusTimer` state machine with `state` (`IDLE | RUNNING | PAUSED`), `remaining` (seconds), `startTimestamp`, and `startRemaining` instance variables; write `formatDisplay(seconds)` returning `"MM:SS"` with zero-padded minutes and seconds
  - [x] 7.2 Write `start()`: guard no-op if already `RUNNING`; snapshot `startRemaining = remaining` and `startTimestamp = Date.now()`; set `state = RUNNING`; begin `setInterval(countdown, 500)` where `countdown()` recalculates `remaining` from the timestamp and transitions to `IDLE` (clearing the interval) when `remaining <= 0`; call `render()`
  - [x] 7.3 Write `stop()`: guard no-op if `IDLE`; compute `elapsed = Math.floor((Date.now() - startTimestamp) / 1000)`; set `remaining = Math.max(0, startRemaining - elapsed)`; clear interval; set `state = PAUSED`; call `render()`
  - [x] 7.4 Write `reset()`: clear interval; set `state = IDLE`, `remaining = 1500`; call `render()`; write `init()` that calls `reset()` and wires the Start, Stop, and Reset button click handlers
  - [x] 7.5 Add `FocusTimer.init()` to the DOMContentLoaded initialization sequence
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 8. Implement TaskManager
  - [x] 8.1 Write `isValidTask(item)` (checks `id`, `text`, `completed`, `createdAt` are correct types and non-empty), and `TaskManager.init()` that calls `LocalStorageService.getJSON("tasks")`, guards with `Array.isArray`, filters items through `isValidTask`, assigns to the in-memory array, and calls `render()`
  - [x] 8.2 Write `TaskManager.addTask(text)`: trim input, reject if empty/whitespace (show red border feedback), create a Task object using `generateId()` and `new Date().toISOString()`, push to array, call `persist()` and `render()`
  - [x] 8.3 Write `TaskManager.editTask(id, newText)`: reject empty/whitespace `newText` (show red border feedback, restore original text), update `text` in the array, call `persist()` and `render()`
  - [x] 8.4 Write `TaskManager.toggleTask(id)` (flip `completed` boolean, `persist()`, `render()`) and `TaskManager.deleteTask(id)` (filter out by `id`, `persist()`, `render()`)
  - [x] 8.5 Write `TaskManager.persist()` calling `LocalStorageService.setJSON("tasks", tasks)`, and `TaskManager.render()` that rebuilds the task list DOM entirely using `document.createElement()` — assign all user text via `.textContent`, never `innerHTML`; include edit (pencil) and delete (trash) buttons per task row; inline edit mode switches the task text to an input field
  - [x] 8.6 Add `TaskManager.init()` to the DOMContentLoaded initialization sequence
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4_

- [x] 9. Implement QuickLinksManager
  - [x] 9.1 Write `isValidUrl(url)`: trim the input, attempt `new URL(trimmedUrl)`, return `false` if the constructor throws, if `protocol` is not `"http:"` or `"https:"`, or if `hostname` is empty or whitespace-only; return `true` otherwise
  - [x] 9.2 Write `isValidLink(item)` (checks `id`, `name` are non-empty strings, `url` passes `isValidUrl`), and `QuickLinksManager.init()` that loads from `LocalStorageService.getJSON("quickLinks")`, guards with `Array.isArray`, filters through `isValidLink`, and calls `render()`
  - [x] 9.3 Write `QuickLinksManager.addLink(name, url)`: trim both inputs; reject empty name or URL (show red border feedback); reject URL that fails `isValidUrl` (show red border feedback on the URL field); store the link with `url` set to `new URL(trimmedUrl).href` (normalized); call `persist()` and `render()`
  - [x] 9.4 Write `QuickLinksManager.deleteLink(id)` (filter out by `id`, `persist()`, `render()`), `QuickLinksManager.openLink(url)` (calls `window.open(url, "_blank", "noopener,noreferrer")`), and `QuickLinksManager.persist()` calling `LocalStorageService.setJSON("quickLinks", links)`
  - [x] 9.5 Write `QuickLinksManager.render()` that rebuilds the links DOM entirely using `document.createElement()` — assign display names via `.textContent`; only set `href` on anchor elements after `isValidUrl` has confirmed the URL; include a delete button per link row
  - [x] 9.6 Add `QuickLinksManager.init()` to the DOMContentLoaded initialization sequence
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 10.1, 10.2, 10.3, 10.4_

- [x] 10. Checkpoint — wire full initialization sequence
  - Confirm the DOMContentLoaded handler in `js/script.js` calls all inits in this order: `ThemeManager.init()`, `GreetingDisplay.init()`, `FocusTimer.init()`, `TaskManager.init()`, `QuickLinksManager.init()`
  - Open `index.html` in a browser and verify the page loads without console errors, the clock ticks, the timer shows 25:00, and both empty lists render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Add input validation UI and storage failure warnings
  - [x] 11.1 Add CSS rules for `.input-error` (red border on invalid inputs) and `.storage-warning` (brief status message style — e.g., fixed/absolute banner that auto-dismisses); write a shared `showStorageWarning(message)` helper in `js/script.js` that appends the warning element, then removes it after ~3 seconds
  - [x] 11.2 Apply `.input-error` class (remove after short delay or on next valid input) in `TaskManager.addTask`, `TaskManager.editTask`, `QuickLinksManager.addLink` for empty/whitespace rejections and invalid URL rejections; call `showStorageWarning` from `LocalStorageService.setJSON` and `setRaw` on storage failure
  - _Requirements: 4.2, 5.3, 9.2, 9.3_

- [x] 12. Checkpoint — verify all features end-to-end
  - Walk through every item in the Manual Integration Testing checklist in `design.md`: Greeting Display, Focus Timer (start/stop/resume/reset/auto-stop at 00:00), Task Manager (add/reject empty/edit/reject empty edit/toggle/delete), Quick Links (add valid/reject empty/reject non-http/reject no-hostname URL/open in new tab/delete), Theme (default dark/toggle/persist/no flash on refresh)
  - Verify responsive layout: at ≥768px timer and tasks are side by side; at <768px all cards stack
  - Verify both themes look correct at all breakpoints
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan — the assignment has no test framework requirement, so no PBT sub-tasks are marked optional)
- Each task references specific requirements for traceability
- Checkpoints (tasks 10, 12) validate integration before moving to the next phase
- The design has a Correctness Properties section, but since the assignment mandates no test framework, those properties are expressed as manual/console verification guidance in the design rather than automated test tasks
- Tasks 2–9 all write into the three files created in task 1; every step leaves the application in a runnable state

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["5.1"] },
    { "id": 5, "tasks": ["5.2", "6.1"] },
    { "id": 6, "tasks": ["6.2"] },
    { "id": 7, "tasks": ["6.3", "7.1"] },
    { "id": 8, "tasks": ["7.2", "7.3"] },
    { "id": 9, "tasks": ["7.4"] },
    { "id": 10, "tasks": ["7.5", "8.1"] },
    { "id": 11, "tasks": ["8.2", "8.3"] },
    { "id": 12, "tasks": ["8.4", "8.5"] },
    { "id": 13, "tasks": ["8.6", "9.1"] },
    { "id": 14, "tasks": ["9.2"] },
    { "id": 15, "tasks": ["9.3", "9.4"] },
    { "id": 16, "tasks": ["9.5"] },
    { "id": 17, "tasks": ["9.6"] },
    { "id": 18, "tasks": ["11.1"] },
    { "id": 19, "tasks": ["11.2"] }
  ]
}
```

---

## Challenge 4: Custom Name in Greeting

- [x] 13. Implement NameManager
  - [x] 13.1 Add `#welcome-name` span, `#name-edit-area` div (hidden), `#name-input`, `#name-save-btn`, `#name-cancel-btn`, and `#edit-name-btn` button to the header in `index.html`
  - [x] 13.2 Write `NameManager` IIFE in `js/script.js`: `init()` restores name from `getRaw("userName")`, renders welcome message, wires edit/save/cancel event listeners; `_save()` trims input, rejects empty with red border, persists via `setRaw("userName", name)`, calls `_render()` and `_exitEditMode()`; `_render()` sets `#welcome-name.textContent` to `"Welcome, [name]!"` or `"Welcome!"`; Enter saves, Escape cancels
  - [x] 13.3 Add `NameManager.init()` to the DOMContentLoaded sequence before `GreetingDisplay.init()`
  - [x] 13.4 Add `.header__right`, `.header__welcome`, `.header__edit-name-btn`, `.header__name-edit`, `.header__name-input` CSS rules in `css/style.css`
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10_

- [x] 14. Verify Challenge 4
  - [x] No name saved → header shows "Welcome!"
  - [x] Click ✏ Name → inline editor appears (no browser prompt)
  - [x] Save with valid name → "Welcome, [name]!" displayed, stored, restored on refresh
  - [x] Save with empty/whitespace → rejected (red border), editor stays open
  - [x] Cancel → editor closes, name unchanged
  - [x] Enter key saves, Escape key cancels
  - [x] Name displayed via textContent (safe against XSS)

---

## Challenge 5: Change Pomodoro Time

- [x] 15. Implement adjustable Pomodoro duration in FocusTimer
  - [x] 15.1 Add `#duration-input` (number, min=1, max=120, default=25), `#duration-apply-btn`, and `#duration-error` paragraph to the Focus Timer card in `index.html`
  - [x] 15.2 Add `_selectedDuration` state variable to `FocusTimer`; update `reset()` to use `_selectedDuration` instead of hardcoded 1500; add `applyDuration()` function that guards on RUNNING state (shows inline error), validates 1–120 integer, sets `_selectedDuration`, persists via `setRaw("pomodoroDuration", minutes)`, calls `reset()`; update `render()` to disable duration controls while RUNNING
  - [x] 15.3 Update `FocusTimer.init()` to restore `_selectedDuration` from `getRaw("pomodoroDuration")` before calling `reset()`, and wire `#duration-apply-btn` click and Enter key on `#duration-input` to `applyDuration()`
  - [x] 15.4 Add `.timer__duration-row`, `.timer__duration-label`, `.timer__duration-input`, `.timer__duration-error` CSS rules in `css/style.css`
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9_

- [x] 16. Verify Challenge 5
  - [x] Default load → timer shows 25:00; duration input shows 25
  - [x] Change to 10, click Set → timer resets to 10:00
  - [x] Start timer, attempt to change duration → rejected with inline error, countdown uninterrupted
  - [x] Stop timer, change to 5 → timer resets to 05:00
  - [x] Reset → restores to currently selected duration (not always 25:00)
  - [x] Refresh page → saved duration restored from localStorage
  - [x] Invalid input (0, 121, non-integer) → rejected with inline error feedback
  - [x] Existing Start/Stop/Resume behavior unchanged
