const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const filterButtons = document.querySelectorAll(".filter-button");
const clearDoneButton = document.querySelector("#clear-done");
const totalCount = document.querySelector("#total-count");
const doneCount = document.querySelector("#done-count");
const openCount = document.querySelector("#open-count");

const storageKey = "focusflow-tasks";

let tasks = JSON.parse(localStorage.getItem(storageKey)) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (currentFilter === "open") {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function updateStats() {
  const completed = tasks.filter((task) => task.done).length;
  totalCount.textContent = tasks.length;
  doneCount.textContent = completed;
  openCount.textContent = tasks.length - completed;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  list.innerHTML = "";

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.done ? "open" : "done"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "x";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    list.appendChild(item);
  });

  emptyState.hidden = visibleTasks.length > 0;
  updateStats();
}

function addTask(text) {
  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    done: false,
    createdAt: new Date().toISOString(),
  });

  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    return;
  }

  addTask(text);
  input.value = "";
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();
