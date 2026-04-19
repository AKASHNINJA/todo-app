// ═══════════════════════════════════════════════
//  AKASH MASTER TRACKER — app.js
//  Architecture: each tracker is a self-contained
//  module with its own state, storage key, and
//  render function. Add new trackers by following
//  the same pattern.
// ═══════════════════════════════════════════════

// ─── UTILS ───────────────────────────────────────
const $ = id => document.getElementById(id);
const load = key => JSON.parse(localStorage.getItem(key) || 'null');
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const todayKey = () => new Date().toISOString().slice(0, 10);
const fmtTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function setGreeting() {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning ☀️' : h < 17 ? 'Good afternoon 👋' : 'Good evening 🌙';
  $('greeting').textContent = g;
}

// ─── ROUTER ──────────────────────────────────────
const APP_META = {
  tasks:   { title: 'My Tasks',       statsId: 'tasks' },
  water:   { title: 'Water Tracker',  statsId: 'water' },
  food:    { title: 'Food Tracker',   statsId: 'food' },
  fitness: { title: 'Fitness',        statsId: 'fitness' },
  custom:  { title: 'My Trackers',    statsId: 'custom' },
};

let activeView = 'tasks';

function switchView(view) {
  activeView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  $(`view-${view}`).classList.add('active');
  document.querySelector(`[data-view="${view}"]`).classList.add('active');
  $('app-title').textContent = APP_META[view].title;
  renderStats(view);
  TRACKERS[view].render();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// FAB opens the correct modal per active view
$('fab').addEventListener('click', () => {
  const modals = {
    tasks: 'modal-task', water: 'modal-water',
    food: 'modal-food', fitness: 'modal-fitness', custom: 'modal-custom',
  };
  openModal(modals[activeView]);
});

// ─── MODAL SYSTEM ────────────────────────────────
function openModal(id) {
  $(id).classList.add('open');
  const firstInput = $(id).querySelector('input');
  if (firstInput) setTimeout(() => firstInput.focus(), 300);
}

function closeModal(id) {
  $(id).classList.remove('open');
  $(id).querySelectorAll('input').forEach(i => i.value = '');
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ─── STATS HEADER ────────────────────────────────
function renderStats(view) {
  const el = $('header-stats');
  const stats = TRACKERS[view]?.getStats?.() || [];
  el.innerHTML = stats.map(s =>
    `<div class="hstat"><span class="hstat-val">${s.val}</span><span class="hstat-lbl">${s.lbl}</span></div>`
  ).join('');
}

// ═══════════════════════════════════════════════
//  TRACKER MODULES
// ═══════════════════════════════════════════════

const TRACKERS = {};

// ───────────────────────────────────────────────
//  1. TASK TRACKER
// ───────────────────────────────────────────────
TRACKERS.tasks = (() => {
  const STORE = 'amt_tasks';
  let todos = load(STORE) || [];
  let filter = 'all';
  let priority = 'low';

  const persist = () => save(STORE, todos);

  function getVisible() {
    if (filter === 'active')    return todos.filter(t => !t.done);
    if (filter === 'completed') return todos.filter(t => t.done);
    return todos;
  }

  function render() {
    const list = $('task-list');
    list.innerHTML = '';
    const empty = $('task-empty');
    const visible = getVisible();

    if (visible.length === 0) {
      empty.classList.add('visible');
      list.appendChild(empty);
      return;
    }
    empty.classList.remove('visible');
    list.appendChild(empty);

    visible.forEach(todo => {
      const i = todos.indexOf(todo);
      const card = document.createElement('div');
      card.className = 'task-card' + (todo.done ? ' done' : '');

      const dot = document.createElement('div');
      dot.className = `priority-dot ${todo.priority || 'low'}`;

      const chk = document.createElement('div');
      chk.className = 'custom-checkbox' + (todo.done ? ' checked' : '');
      chk.addEventListener('click', () => { todos[i].done = !todos[i].done; persist(); render(); renderStats('tasks'); });

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = todo.text;

      const del = document.createElement('button');
      del.className = 'delete-btn'; del.textContent = '✕';
      del.addEventListener('click', () => { todos.splice(i, 1); persist(); render(); renderStats('tasks'); });

      card.append(dot, chk, text, del);
      list.appendChild(card);
    });
  }

  function addTask() {
    const text = $('task-input').value.trim();
    if (!text) return;
    todos.unshift({ text, done: false, priority, createdAt: Date.now() });
    persist(); closeModal('modal-task'); render(); renderStats('tasks');
  }

  function getStats() {
    const done = todos.filter(t => t.done).length;
    return [
      { val: todos.length, lbl: 'Total' },
      { val: todos.length - done, lbl: 'Active' },
      { val: done, lbl: 'Done' },
    ];
  }

  // Events
  $('task-add-btn').addEventListener('click', addTask);
  $('task-input').addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      filter = tab.dataset.filter;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render();
    });
  });

  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      priority = btn.dataset.priority;
      document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  return { render, getStats };
})();

// ───────────────────────────────────────────────
//  2. WATER TRACKER
// ───────────────────────────────────────────────
TRACKERS.water = (() => {
  const STORE     = 'amt_water';
  const GOAL_KEY  = 'amt_water_goal';
  const CIRC      = 314; // 2 * π * r (r=50)

  function getState() {
    const today = todayKey();
    const stored = load(STORE) || {};
    if (stored.date !== today) return { date: today, entries: [] };
    return stored;
  }

  let state = getState();
  let goal  = load(GOAL_KEY) || 8;

  const persist = () => save(STORE, state);

  function render() {
    const cups = state.entries.reduce((s, e) => s + e.cups, 0);
    const pct  = Math.min(cups / goal, 1);

    $('water-val').textContent = cups;
    $('water-goal-label').textContent = goal;
    $('water-pct').textContent = `${Math.round(pct * 100)}% of daily goal`;
    $('water-ring').style.strokeDashoffset = CIRC - CIRC * pct;

    const log = $('water-log');
    log.innerHTML = '';
    const empty = $('water-empty');

    if (state.entries.length === 0) {
      empty.classList.add('visible');
      log.appendChild(empty);
      return;
    }
    empty.classList.remove('visible');
    log.appendChild(empty);

    [...state.entries].reverse().forEach((entry, ri) => {
      const i = state.entries.length - 1 - ri;
      const el = document.createElement('div');
      el.className = 'water-entry';
      el.innerHTML = `
        <div class="water-entry-left">
          <span class="water-entry-amt">💧 +${entry.cups} cup${entry.cups > 1 ? 's' : ''} (${entry.cups * 250}ml)</span>
          <span class="water-entry-time">${entry.time}</span>
        </div>
        <button class="delete-btn">✕</button>`;
      el.querySelector('.delete-btn').addEventListener('click', () => {
        state.entries.splice(i, 1); persist(); render(); renderStats('water');
      });
      log.appendChild(el);
    });
  }

  function addWater(cups) {
    state.entries.push({ cups, time: fmtTime(), ts: Date.now() });
    persist(); render(); renderStats('water');
  }

  function setGoal() {
    const val = parseInt($('water-goal-input').value);
    if (!val || val < 1) return;
    goal = val; save(GOAL_KEY, goal);
    closeModal('modal-water'); render(); renderStats('water');
  }

  function getStats() {
    const cups = state.entries.reduce((s, e) => s + e.cups, 0);
    return [
      { val: cups, lbl: 'Cups Today' },
      { val: goal, lbl: 'Daily Goal' },
      { val: `${Math.round((cups / goal) * 100)}%`, lbl: 'Progress' },
    ];
  }

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => addWater(parseInt(btn.dataset.cups)));
  });
  $('water-goal-btn').addEventListener('click', setGoal);
  $('water-reset').addEventListener('click', () => {
    state = { date: todayKey(), entries: [] };
    persist(); render(); renderStats('water');
  });

  return { render, getStats };
})();

// ───────────────────────────────────────────────
//  3. FOOD TRACKER
// ───────────────────────────────────────────────
TRACKERS.food = (() => {
  const STORE    = 'amt_food';
  const GOAL_KEY = 'amt_food_goal';

  function getState() {
    const today = todayKey();
    const stored = load(STORE) || {};
    if (stored.date !== today) return { date: today, entries: [] };
    return stored;
  }

  let state    = getState();
  let goal     = load(GOAL_KEY) || 2000;
  let mealTab  = 'breakfast';

  const persist = () => save(STORE, state);

  function render() {
    const total = state.entries.reduce((s, e) => s + e.cal, 0);
    const pct   = Math.min((total / goal) * 100, 100);
    const rem   = Math.max(goal - total, 0);

    $('food-consumed').textContent = total;
    $('food-goal-val').textContent = goal;
    $('food-bar').style.width = pct + '%';
    $('food-bar').style.background = pct >= 100 ? 'var(--danger)' : pct > 75 ? 'var(--yellow)' : 'var(--green)';
    $('food-sub').textContent = pct >= 100 ? `${total - goal} kcal over goal` : `${rem} kcal remaining`;

    const list = $('food-list');
    list.innerHTML = '';
    const empty = $('food-empty');
    const visible = state.entries.filter(e => e.meal === mealTab);

    if (visible.length === 0) { empty.classList.add('visible'); list.appendChild(empty); return; }
    empty.classList.remove('visible'); list.appendChild(empty);

    visible.forEach(entry => {
      const i = state.entries.indexOf(entry);
      const el = document.createElement('div');
      el.className = 'food-entry';
      el.innerHTML = `
        <div>
          <div class="food-entry-name">${entry.name}</div>
          <div class="food-entry-meta">${entry.meal} · ${entry.time}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="food-entry-cal">${entry.cal} kcal</span>
          <button class="delete-btn">✕</button>
        </div>`;
      el.querySelector('.delete-btn').addEventListener('click', () => {
        state.entries.splice(i, 1); persist(); render(); renderStats('food');
      });
      list.appendChild(el);
    });
  }

  function addFood() {
    const name = $('food-name-input').value.trim();
    const cal  = parseInt($('food-cal-input').value);
    if (!name || !cal) return;
    state.entries.push({ name, cal, meal: mealTab, time: fmtTime(), ts: Date.now() });
    persist(); closeModal('modal-food'); render(); renderStats('food');
  }

  function getStats() {
    const total = state.entries.reduce((s, e) => s + e.cal, 0);
    return [
      { val: total, lbl: 'Eaten (kcal)' },
      { val: goal, lbl: 'Goal (kcal)' },
      { val: state.entries.length, lbl: 'Items' },
    ];
  }

  document.querySelectorAll('.meal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      mealTab = tab.dataset.meal;
      document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      render();
    });
  });
  $('food-add-btn').addEventListener('click', addFood);

  return { render, getStats };
})();

// ───────────────────────────────────────────────
//  4. FITNESS TRACKER
// ───────────────────────────────────────────────
TRACKERS.fitness = (() => {
  const STORE       = 'amt_fitness';
  const STREAK_KEY  = 'amt_fitness_streak';

  function getState() {
    const today = todayKey();
    const stored = load(STORE) || {};
    return { ...stored, today: stored.today || today, entries: stored.entries || [], allDates: stored.allDates || [] };
  }

  let state = getState();

  function computeStreak() {
    const dates = [...new Set(state.allDates)].sort().reverse();
    if (!dates.length) return 0;
    let streak = 0, cur = new Date();
    for (const d of dates) {
      const diff = Math.round((cur - new Date(d)) / 86400000);
      if (diff > 1) break;
      streak++;
      cur = new Date(d);
    }
    return streak;
  }

  const persist = () => {
    const today = todayKey();
    if (!state.allDates.includes(today) && state.entries.some(e => e.date === today)) {
      state.allDates.push(today);
    }
    save(STORE, state);
  };

  function render() {
    const today = todayKey();
    const todayEntries = state.entries.filter(e => e.date === today);
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
    const weekEntries = state.entries.filter(e => e.date >= weekAgo);

    $('streak-num').textContent = computeStreak();
    $('fit-today').textContent  = todayEntries.length;
    $('fit-week').textContent   = weekEntries.length;
    $('fit-total').textContent  = state.entries.length;

    const list = $('fitness-list');
    list.innerHTML = '';
    const empty = $('fitness-empty');

    if (todayEntries.length === 0) { empty.classList.add('visible'); list.appendChild(empty); return; }
    empty.classList.remove('visible'); list.appendChild(empty);

    [...todayEntries].reverse().forEach(entry => {
      const i = state.entries.lastIndexOf(entry);
      const el = document.createElement('div');
      el.className = 'fitness-entry';
      el.innerHTML = `
        <div class="fitness-entry-left">
          <span class="fitness-entry-name">${entry.name}</span>
          <span class="fitness-entry-meta">${entry.reps} reps/min · ${entry.time}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span class="fitness-entry-badge badge-${entry.type}">${entry.type}</span>
          <button class="delete-btn">✕</button>
        </div>`;
      el.querySelector('.delete-btn').addEventListener('click', () => {
        state.entries.splice(i, 1); persist(); render(); renderStats('fitness');
      });
      list.appendChild(el);
    });
  }

  function addWorkout() {
    const name = $('fitness-name-input').value.trim();
    const reps = $('fitness-reps-input').value;
    const type = $('fitness-type-input').value;
    if (!name || !reps) return;
    state.entries.push({ name, reps, type, date: todayKey(), time: fmtTime(), ts: Date.now() });
    persist(); closeModal('modal-fitness'); render(); renderStats('fitness');
  }

  function getStats() {
    const today = todayKey();
    return [
      { val: state.entries.filter(e => e.date === today).length, lbl: 'Today' },
      { val: computeStreak(), lbl: 'Streak 🔥' },
      { val: state.entries.length, lbl: 'Total' },
    ];
  }

  $('fitness-add-btn').addEventListener('click', addWorkout);

  return { render, getStats };
})();

// ───────────────────────────────────────────────
//  5. CUSTOM TRACKER
// ───────────────────────────────────────────────
TRACKERS.custom = (() => {
  const STORE = 'amt_custom';

  function getState() {
    return load(STORE) || { trackers: [] };
  }

  let state = getState();
  const persist = () => save(STORE, state);

  function todayProgress(tracker) {
    const today = todayKey();
    return (tracker.log || []).filter(e => e.date === today).reduce((s, e) => s + e.val, 0);
  }

  function render() {
    const grid = $('custom-grid');
    grid.innerHTML = '';
    const empty = $('custom-empty');

    if (state.trackers.length === 0) { empty.classList.add('visible'); grid.appendChild(empty); return; }
    empty.classList.remove('visible'); grid.appendChild(empty);

    state.trackers.forEach((tracker, i) => {
      const progress = todayProgress(tracker);
      const pct = Math.min((progress / tracker.goal) * 100, 100);

      const card = document.createElement('div');
      card.className = 'custom-card';
      card.innerHTML = `
        <button class="custom-delete" data-i="${i}">✕</button>
        <span class="custom-card-icon">${tracker.icon || '📊'}</span>
        <span class="custom-card-name">${tracker.name}</span>
        <span class="custom-card-progress">${progress}<small style="font-size:0.65rem;color:var(--muted)"> ${tracker.unit}</small></span>
        <span class="custom-card-goal">Goal: ${tracker.goal} ${tracker.unit}</span>
        <div class="custom-bar"><div class="custom-bar-fill" style="width:${pct}%"></div></div>
        <div class="custom-card-btns">
          <button class="custom-dec" data-i="${i}">−</button>
          <button class="custom-inc" data-i="${i}">+</button>
        </div>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.custom-inc').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i);
        state.trackers[i].log = state.trackers[i].log || [];
        state.trackers[i].log.push({ val: 1, date: todayKey(), ts: Date.now() });
        persist(); render(); renderStats('custom');
      });
    });

    grid.querySelectorAll('.custom-dec').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i);
        const t = state.trackers[i];
        if (todayProgress(t) <= 0) return;
        const today = todayKey();
        const idx = (t.log || []).map((e, j) => ({ e, j })).filter(({ e }) => e.date === today).pop()?.j;
        if (idx !== undefined) { t.log.splice(idx, 1); persist(); render(); renderStats('custom'); }
      });
    });

    grid.querySelectorAll('.custom-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trackers.splice(parseInt(btn.dataset.i), 1);
        persist(); render(); renderStats('custom');
      });
    });
  }

  function addTracker() {
    const name = $('custom-name-input').value.trim();
    const goal = parseInt($('custom-goal-input').value);
    const unit = $('custom-unit-input').value.trim() || 'times';
    const icon = $('custom-icon-input').value.trim() || '📊';
    if (!name || !goal) return;
    state.trackers.push({ name, goal, unit, icon, log: [], createdAt: Date.now() });
    persist(); closeModal('modal-custom'); render(); renderStats('custom');
  }

  function getStats() {
    const today = todayKey();
    const active = state.trackers.filter(t => todayProgress(t) > 0).length;
    const done   = state.trackers.filter(t => todayProgress(t) >= t.goal).length;
    return [
      { val: state.trackers.length, lbl: 'Trackers' },
      { val: active, lbl: 'Active Today' },
      { val: done, lbl: 'Goals Hit' },
    ];
  }

  $('custom-add-btn').addEventListener('click', addTracker);

  return { render, getStats };
})();

// ─── INIT ─────────────────────────────────────
setGreeting();
switchView('tasks');
