const taskList    = document.getElementById('task-list');
const emptyState  = document.getElementById('empty-state');
const fab         = document.getElementById('fab');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose  = document.getElementById('modal-close');
const todoInput   = document.getElementById('todo-input');
const addBtn      = document.getElementById('add-btn');
const clearNavBtn = document.getElementById('clear-nav-btn');
const tabs        = document.querySelectorAll('.tab');
const priorityBtns = document.querySelectorAll('.priority-btn');
const statTotal   = document.getElementById('stat-total');
const statActive  = document.getElementById('stat-active');
const statDone    = document.getElementById('stat-done');

let todos    = JSON.parse(localStorage.getItem('todos') || '[]');
let filter   = 'all';
let priority = 'low';

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function getVisible() {
  if (filter === 'active')    return todos.filter(t => !t.done);
  if (filter === 'completed') return todos.filter(t => t.done);
  return todos;
}

function updateStats() {
  const total  = todos.length;
  const done   = todos.filter(t => t.done).length;
  statTotal.textContent  = total;
  statActive.textContent = total - done;
  statDone.textContent   = done;
}

function render() {
  taskList.innerHTML = '';
  taskList.appendChild(emptyState);

  const visible = getVisible();

  if (visible.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    visible.forEach(todo => {
      const i = todos.indexOf(todo);
      const card = document.createElement('div');
      card.className = 'task-card' + (todo.done ? ' done' : '');

      const dot = document.createElement('div');
      dot.className = `priority-dot ${todo.priority || 'low'}`;

      const checkbox = document.createElement('div');
      checkbox.className = 'custom-checkbox' + (todo.done ? ' checked' : '');
      checkbox.addEventListener('click', () => toggle(i));

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = todo.text;

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.innerHTML = '✕';
      del.title = 'Delete';
      del.addEventListener('click', () => remove(i));

      card.append(dot, checkbox, text, del);
      taskList.appendChild(card);
    });
  }

  updateStats();
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  todos.unshift({ text, done: false, priority });
  todoInput.value = '';
  closeModal();
  save();
  render();
}

function toggle(i) {
  todos[i].done = !todos[i].done;
  save();
  render();
}

function remove(i) {
  todos.splice(i, 1);
  save();
  render();
}

function openModal() {
  modalOverlay.classList.add('open');
  setTimeout(() => todoInput.focus(), 300);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  todoInput.value = '';
}

fab.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

clearNavBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filter = tab.dataset.filter;
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    render();
  });
});

priorityBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    priority = btn.dataset.priority;
    priorityBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

render();
