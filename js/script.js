// ===== LocalStorageService =====

const LocalStorageService = {
  /**
   * Retrieves a value from localStorage and parses it as JSON.
   * Returns null if the key is missing or the stored value is corrupt.
   * @param {string} key
   * @returns {any|null}
   */
  getJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Serializes value as JSON and stores it under key.
   * On QuotaExceededError or any other storage error, logs to console and
   * shows a brief user-visible warning via showStorageWarning().
   * @param {string} key
   * @param {any} value
   */
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('[LocalStorageService] setJSON failed for key "' + key + '":', err);
      showStorageWarning('Could not save data — storage may be full. Changes will be lost on refresh.');
    }
  },

  /**
   * Returns the raw string stored under key, or null if the key is absent.
   * @param {string} key
   * @returns {string|null}
   */
  getRaw(key) {
    return localStorage.getItem(key);
  },

  /**
   * Stores a raw string value under key.
   * On failure, logs to console and shows a brief user-visible warning via showStorageWarning().
   * @param {string} key
   * @param {string} value
   */
  setRaw(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error('[LocalStorageService] setRaw failed for key "' + key + '":', err);
      showStorageWarning('Could not save preference — storage may be full. Changes will be lost on refresh.');
    }
  },

  /**
   * Removes the entry with the given key from localStorage.
   * @param {string} key
   */
  removeItem(key) {
    localStorage.removeItem(key);
  },
};

// ===== ThemeManager =====

const ThemeManager = (() => {
  let _theme = 'dark';

  function _applyIcon() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Dark mode → show sun (clicking will switch to light)
    // Light mode → show moon (clicking will switch to dark)
    btn.textContent = _theme === 'dark' ? '☀' : '🌙';
  }

  return {
    init() {
      const saved = LocalStorageService.getRaw('theme');
      _theme = saved === 'light' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', _theme);
      _applyIcon();
    },

    toggle() {
      _theme = _theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', _theme);
      LocalStorageService.setRaw('theme', _theme);
      _applyIcon();
    },

    getTheme() {
      return _theme;
    },
  };
})();

// ===== Utilities =====

/**
 * Generates a unique string ID.
 * Uses crypto.randomUUID() when available to eliminate collision risk.
 * Falls back to a Date.now() + random suffix combination for older browsers.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

// ===== GreetingDisplay =====

/**
 * Formats a Date object as a 24-hour "HH:MM" string with zero-padded hour and minute.
 * @param {Date} date
 * @returns {string} e.g. "09:05" or "14:30"
 */
function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return hh + ':' + mm;
}

/**
 * Formats a Date object as "Weekday, Day Month Year".
 * Day has no leading zero; month and weekday are full English names.
 * @param {Date} date
 * @returns {string} e.g. "Monday, 1 January 2025"
 */
function formatDate(date) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return weekday + ', ' + day + ' ' + month + ' ' + year;
}

/**
 * Returns a time-based greeting for the given hour (0–23).
 * 0–11  → "Good Morning"
 * 12–17 → "Good Afternoon"
 * 18–23 → "Good Evening"
 * @param {number} hour - integer in range 0–23
 * @returns {string}
 */
function getGreeting(hour) {
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

const GreetingDisplay = {
  tick() {
    const now = new Date();

    const clockEl = document.getElementById('clock');
    if (clockEl) clockEl.textContent = formatTime(now);

    const dateEl = document.getElementById('date-display');
    if (dateEl) dateEl.textContent = formatDate(now);

    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = getGreeting(now.getHours());
  },

  init() {
    this.tick();
    setInterval(() => this.tick(), 1000);
  },
};

// ===== FocusTimer =====

const FocusTimer = (() => {
  let state = 'IDLE';       // 'IDLE' | 'RUNNING' | 'PAUSED'
  let remaining = 1500;     // seconds
  let startTimestamp = 0;   // ms, from Date.now()
  let startRemaining = 0;   // seconds snapshot when start() is called
  let _intervalId = null;

  /**
   * Returns a zero-padded "MM:SS" string for the given total seconds.
   * @param {number} seconds
   * @returns {string}
   */
  function formatDisplay(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  function render() {
    const displayEl = document.getElementById('timer-display');
    if (displayEl) displayEl.textContent = formatDisplay(remaining);

    const startBtn = document.getElementById('timer-start');
    const stopBtn  = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');

    if (startBtn) startBtn.disabled = state === 'RUNNING';
    if (stopBtn)  stopBtn.disabled  = state === 'IDLE';
    if (resetBtn) resetBtn.disabled = false;
  }

  function start() {
    if (state === 'RUNNING') return;

    startRemaining = remaining;
    startTimestamp = Date.now();
    state = 'RUNNING';

    _intervalId = setInterval(() => {
      remaining = Math.max(0, startRemaining - Math.floor((Date.now() - startTimestamp) / 1000));
      render();
      if (remaining <= 0) {
        clearInterval(_intervalId);
        _intervalId = null;
        state = 'IDLE';
        render();
      }
    }, 500);

    render();
  }

  function stop() {
    if (state === 'IDLE') return;

    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
    remaining = Math.max(0, startRemaining - elapsed);

    clearInterval(_intervalId);
    _intervalId = null;
    state = 'PAUSED';
    render();
  }

  function reset() {
    clearInterval(_intervalId);
    _intervalId = null;
    state = 'IDLE';
    remaining = 1500;
    render();
  }

  function init() {
    reset();

    const startBtn = document.getElementById('timer-start');
    const stopBtn  = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');

    if (startBtn) startBtn.addEventListener('click', start);
    if (stopBtn)  stopBtn.addEventListener('click', stop);
    if (resetBtn) resetBtn.addEventListener('click', reset);
  }

  return { init, formatDisplay };
})();

// ===== Storage Warning Helper =====

/**
 * Briefly shows a fixed warning banner at the bottom of the screen,
 * then fades it out and removes it after ~3 seconds.
 * @param {string} message
 */
function showStorageWarning(message) {
  const el = document.createElement('div');
  el.className = 'storage-warning';
  el.textContent = message;
  document.body.appendChild(el);

  // Begin fade after 2.6 s, then remove after fade completes (0.4 s transition)
  setTimeout(() => {
    el.classList.add('storage-warning--fade');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }, 2600);
}

// ===== TaskManager =====

/**
 * Returns true when item is a structurally valid Task object.
 * @param {any} item
 * @returns {boolean}
 */
function isValidTask(item) {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.id !== 'string' || item.id.trim() === '') return false;
  if (typeof item.text !== 'string' || item.text.trim() === '') return false;
  if (typeof item.completed !== 'boolean') return false;
  if (typeof item.createdAt !== 'string' || item.createdAt.trim() === '') return false;
  return true;
}

const TaskManager = (() => {
  /** @type {Array<{id:string, text:string, completed:boolean, createdAt:string}>} */
  let tasks = [];

  // ── 8.5 persist ──────────────────────────────────────────────────────────

  function persist() {
    LocalStorageService.setJSON('tasks', tasks);
  }

  // ── 8.5 render ───────────────────────────────────────────────────────────

  function render() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;

    // Read current sort selection (the <select> in the HTML stays between renders)
    const sortSelect = document.getElementById('sort-select');
    const sortOrder = sortSelect ? sortSelect.value : 'active-first';

    // Sort a *copy* — never mutate the canonical array
    const sorted = tasks.slice().sort((a, b) => {
      if (sortOrder === 'completed-first') {
        // completed before incomplete, stable within each group
        if (a.completed !== b.completed) return a.completed ? -1 : 1;
        return 0;
      }
      if (sortOrder === 'alphabetical') {
        return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
      }
      // default: active-first — incomplete before completed
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return 0;
    });

    // Rebuild the list
    listEl.innerHTML = '';

    sorted.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.dataset.id = task.id;

      // ── Checkbox ──────────────────────────────────────────────────
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-item__checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task as ' + (task.completed ? 'incomplete' : 'complete'));
      checkbox.addEventListener('change', () => toggleTask(task.id));

      // ── Text span (normal view) ────────────────────────────────────
      const textSpan = document.createElement('span');
      textSpan.className = 'task-item__text' +
        (task.completed ? ' task-item__text--completed' : '');
      textSpan.textContent = task.text;

      // ── Actions wrapper ───────────────────────────────────────────
      const actions = document.createElement('div');
      actions.className = 'task-item__actions';

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn--icon';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.textContent = '✏';
      editBtn.addEventListener('click', () => enterEditMode(li, task, textSpan, editBtn, deleteBtn));

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn--danger-icon';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.textContent = '🗑';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(actions);

      listEl.appendChild(li);
    });
  }

  // ── Inline edit mode ─────────────────────────────────────────────────────

  /**
   * Switches a task row into inline edit mode.
   * @param {HTMLLIElement} li
   * @param {{id:string, text:string}} task
   * @param {HTMLSpanElement} textSpan
   * @param {HTMLButtonElement} editBtn
   * @param {HTMLButtonElement} deleteBtn
   */
  function enterEditMode(li, task, textSpan, editBtn, deleteBtn) {
    // Prevent entering edit mode a second time
    if (li.querySelector('.task-item__edit-input')) return;

    // Hide the static text span
    textSpan.style.display = 'none';

    // Create the inline edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-item__edit-input';
    editInput.value = task.text;
    editInput.setAttribute('aria-label', 'Edit task description');

    // ── Confirm button ────────────────────────────────────────────
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn btn--icon';
    confirmBtn.setAttribute('aria-label', 'Confirm edit');
    confirmBtn.textContent = '✔';

    // ── Cancel button ─────────────────────────────────────────────
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn--icon';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');
    cancelBtn.textContent = '✕';

    // Replace static text with the input, swap action buttons
    li.insertBefore(editInput, textSpan.nextSibling);
    // Clear existing action buttons; add confirm/cancel instead
    const actionsEl = li.querySelector('.task-item__actions');
    actionsEl.innerHTML = '';
    actionsEl.appendChild(confirmBtn);
    actionsEl.appendChild(cancelBtn);

    editInput.focus();
    editInput.select();

    // Remove error message if any
    const existing = li.querySelector('.task-error-msg');
    if (existing) existing.remove();

    function exitEditMode() {
      editInput.remove();
      textSpan.style.display = '';
      actionsEl.innerHTML = '';
      actionsEl.appendChild(editBtn);
      actionsEl.appendChild(deleteBtn);
      const err = li.querySelector('.task-error-msg');
      if (err) err.remove();
    }

    confirmBtn.addEventListener('click', () => {
      const newText = editInput.value.trim();

      // Reject empty
      if (!newText) {
        editInput.classList.add('input-error');
        setTimeout(() => editInput.classList.remove('input-error'), 1500);
        return;
      }

      // Reject duplicate against OTHER tasks
      const duplicate = tasks.some(
        (t) => t.id !== task.id && t.text.trim().toLowerCase() === newText.toLowerCase()
      );
      if (duplicate) {
        editInput.classList.add('input-error');
        // Show inline error message
        let errMsg = li.querySelector('.task-error-msg');
        if (!errMsg) {
          errMsg = document.createElement('span');
          errMsg.className = 'task-error-msg';
          errMsg.style.display = 'block';
          li.after(errMsg);
        }
        errMsg.textContent = 'A task with that name already exists.';
        setTimeout(() => {
          editInput.classList.remove('input-error');
          if (errMsg.parentNode) errMsg.parentNode.removeChild(errMsg);
        }, 2000);
        return;
      }

      editTask(task.id, newText);
    });

    cancelBtn.addEventListener('click', exitEditMode);

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    });
  }

  // ── 8.2 addTask ───────────────────────────────────────────────────────────

  function addTask(text) {
    const trimmed = text.trim();
    const inputEl = document.getElementById('task-input');

    // Reject empty / whitespace
    if (!trimmed) {
      if (inputEl) {
        inputEl.classList.add('input-error');
        setTimeout(() => inputEl.classList.remove('input-error'), 1500);
      }
      return;
    }

    // Reject duplicate (case-insensitive)
    const duplicate = tasks.some(
      (t) => t.text.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      if (inputEl) inputEl.classList.add('input-error');

      // Show / update inline error message
      const inputRow = inputEl ? inputEl.closest('.tasks__input-row') : null;
      if (inputRow) {
        let errMsg = inputRow.parentNode.querySelector('.task-error-msg');
        if (!errMsg) {
          errMsg = document.createElement('p');
          errMsg.className = 'task-error-msg';
          inputRow.after(errMsg);
        }
        errMsg.textContent = 'A task with that name already exists.';
        setTimeout(() => {
          if (inputEl) inputEl.classList.remove('input-error');
          if (errMsg.parentNode) errMsg.parentNode.removeChild(errMsg);
        }, 2000);
      }
      return;
    }

    const newTask = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    persist();
    render();

    // Clear the input after successful add
    if (inputEl) inputEl.value = '';
  }

  // ── 8.3 editTask ──────────────────────────────────────────────────────────

  function editTask(id, newText) {
    const trimmed = newText.trim();

    // Reject empty
    if (!trimmed) return;

    // Reject duplicate against OTHER tasks
    const duplicate = tasks.some(
      (t) => t.id !== id && t.text.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) return;

    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.text = trimmed;
    persist();
    render();
  }

  // ── 8.4 toggleTask ────────────────────────────────────────────────────────

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    persist();
    render();
  }

  // ── 8.4 deleteTask ────────────────────────────────────────────────────────

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    persist();
    render();
  }

  // ── 8.1 init ──────────────────────────────────────────────────────────────

  function init() {
    const raw = LocalStorageService.getJSON('tasks');
    tasks = Array.isArray(raw) ? raw.filter(isValidTask) : [];

    // Wire add-task button and Enter key on the input
    const addBtn = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');

    if (addBtn) {
      addBtn.addEventListener('click', () => addTask(taskInput ? taskInput.value : ''));
    }
    if (taskInput) {
      taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask(taskInput.value);
      });
    }

    // Wire sort control — re-render on change without touching the data
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => render());
    }

    render();
  }

  return { init, addTask, editTask, toggleTask, deleteTask, persist, render };
})();

// ===== QuickLinksManager =====

/**
 * Validates a URL string according to the requirements:
 * - Trims input
 * - Accepts only http: or https: protocols
 * - Rejects empty or whitespace-only hostnames
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  const trimmed = url.trim();
  
  try {
    const parsed = new URL(trimmed);
    
    // Reject if protocol is not http: or https:
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    
    // Reject if hostname is empty or whitespace-only
    if (!parsed.hostname || parsed.hostname.trim() === '') {
      return false;
    }
    
    return true;
  } catch {
    // URL constructor threw — malformed URL
    return false;
  }
}

/**
 * Returns true when item is a structurally valid Link object.
 * @param {any} item
 * @returns {boolean}
 */
function isValidLink(item) {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.id !== 'string' || item.id.trim() === '') return false;
  if (typeof item.name !== 'string' || item.name.trim() === '') return false;
  if (typeof item.url !== 'string' || !isValidUrl(item.url)) return false;
  return true;
}

const QuickLinksManager = (() => {
  /** @type {Array<{id:string, name:string, url:string}>} */
  let links = [];

  // ── persist ──────────────────────────────────────────────────────────────

  function persist() {
    LocalStorageService.setJSON('quickLinks', links);
  }

  // ── render ───────────────────────────────────────────────────────────────

  function render() {
    const listEl = document.getElementById('links-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    links.forEach((link) => {
      const li = document.createElement('li');
      li.className = 'link-item';
      li.dataset.id = link.id;

      // ── Anchor element ────────────────────────────────────────────
      const anchor = document.createElement('a');
      anchor.className = 'link-item__anchor';
      anchor.textContent = link.name;
      
      // Only set href after validation (defense in depth)
      if (isValidUrl(link.url)) {
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', 'Open ' + link.name);
      }

      // Prevent default and use openLink for consistent behavior
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        openLink(link.url);
      });

      // ── Delete button ─────────────────────────────────────────────
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn--danger-icon';
      deleteBtn.setAttribute('aria-label', 'Delete link');
      deleteBtn.textContent = '🗑';
      deleteBtn.addEventListener('click', () => deleteLink(link.id));

      li.appendChild(anchor);
      li.appendChild(deleteBtn);
      listEl.appendChild(li);
    });
  }

  // ── addLink ──────────────────────────────────────────────────────────────

  function addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    const nameInput = document.getElementById('link-name-input');
    const urlInput = document.getElementById('link-url-input');

    // Reject empty name
    if (!trimmedName) {
      if (nameInput) {
        nameInput.classList.add('input-error');
        setTimeout(() => nameInput.classList.remove('input-error'), 1500);
      }
      return;
    }

    // Reject empty URL
    if (!trimmedUrl) {
      if (urlInput) {
        urlInput.classList.add('input-error');
        setTimeout(() => urlInput.classList.remove('input-error'), 1500);
      }
      return;
    }

    // Reject invalid URL
    if (!isValidUrl(trimmedUrl)) {
      if (urlInput) {
        urlInput.classList.add('input-error');
        setTimeout(() => urlInput.classList.remove('input-error'), 1500);
      }
      return;
    }

    // Normalize URL via URL constructor
    const normalizedUrl = new URL(trimmedUrl).href;

    const newLink = {
      id: generateId(),
      name: trimmedName,
      url: normalizedUrl,
      createdAt: new Date().toISOString(),
    };

    links.push(newLink);
    persist();
    render();

    // Clear inputs after successful add
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
  }

  // ── deleteLink ───────────────────────────────────────────────────────────

  function deleteLink(id) {
    links = links.filter((link) => link.id !== id);
    persist();
    render();
  }

  // ── openLink ─────────────────────────────────────────────────────────────

  function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // ── init ─────────────────────────────────────────────────────────────────

  function init() {
    const raw = LocalStorageService.getJSON('quickLinks');
    links = Array.isArray(raw) ? raw.filter(isValidLink) : [];

    // Wire add-link button
    const addBtn = document.getElementById('add-link-btn');
    const nameInput = document.getElementById('link-name-input');
    const urlInput = document.getElementById('link-url-input');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addLink(
          nameInput ? nameInput.value : '',
          urlInput ? urlInput.value : ''
        );
      });
    }

    // Allow Enter key on either input to trigger add
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          addLink(nameInput.value, urlInput ? urlInput.value : '');
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          addLink(nameInput ? nameInput.value : '', urlInput.value);
        }
      });
    }

    render();
  }

  return { init, addLink, deleteLink, openLink, persist, render };
})();

// ===== Initialization =====

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();

  // Wire theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => ThemeManager.toggle());
  }

  GreetingDisplay.init();
  FocusTimer.init();
  TaskManager.init();
  QuickLinksManager.init();
});
