import copyingText from "./functions/copyingText.js";
import { initSettings, openSettings, closeSettings } from "./functions/settings.js";
import {
  extensionOnly,
  lockerCut,
  nameOnly,
  terminalClean,
  trashLinen,
  agv,
  externalDepartments,
  alarmFormatter,
  codes,
  codeRemarks,
  geRemarks,
  hrhItRemarks,
  clearCodeRemarks,
  asPerRemarks
} from "./functions/promptFunctions.js";
import allScripts from "./functions/allScripts.js";
import categories from "./functions/categories.js";
import showMenu from "./functions/menu.js";

// ================= BUTTON SCRIPTS =================
// What a button does, by its id. Event items come from the category boxes,
// remarks from the row of buttons that is always on the page.
function handleItem(id) {
    const allowedExtensionOnly = ["doorAccess", "tooHot", "tooCold", "toiletClogged", "sinkClogged", "lights", "lightsDark", "aprDeactivate", "aprActivate"];
    const allowedNameOnly = ["remarksAssignedJciGen", "remarksNotifiedJciGen", "remarksTemp"];
    const allowedExternalDepartments = ["biomed", "humberIt", "ge"];
    const allowedCodeIds = ["codeLine", "nc"];

    if (allowedExtensionOnly.includes(id)) {
      extensionOnly(allScripts[id]);
    }
    else if (id === "lockerCut") {
      lockerCut(allScripts[id]);
    }
    else if (allowedExternalDepartments.includes(id)) {
      externalDepartments(allScripts[id], id);
    }
    else if (allowedNameOnly.includes(id)) {
      nameOnly(allScripts[id], id);
    }
    else if (id === "terminalClean") {
      terminalClean(allScripts[id]);
    }
    else if (id === "trash" || id === "linen") {
      trashLinen(allScripts[id]);
    }
    else if (id === "agv") {
      agv(allScripts[id]);
    }
    else if (id === "alarmFormatter") {
      alarmFormatter();
    }
    else if (allowedCodeIds.includes(id)) {
      codes(allScripts[id], id);
    }
    else if (id === "remarksCode") {
      codeRemarks(allScripts[id]);
    }
    else if (id === "remarksGe") {
      geRemarks(allScripts[id]);
    }
    else if (id === "remarksHrhIt") {
      hrhItRemarks(allScripts[id]);
    }
    else if (id === "remarksAsPer") {
      asPerRemarks();
    }
    else if (id=="remarksClearCode") {
      clearCodeRemarks(allScripts[id]);
    }
    else {
      copyingText(allScripts[id]);
    }
}

// Remarks: always on the main screen.
document.querySelectorAll('.remarks .item').forEach(item => {
  item.onclick = () => handleItem(item.id);
});

// Events: one button per category, each opening a small box of its items.
const categoryRow = document.getElementById("categoryButtons");
categories.forEach(cat => {
  const button = document.createElement("span");
  button.className = "item";
  button.id = "category-" + cat.id;
  button.textContent = cat.label;
  button.onclick = async () => {
    const chosen = await showMenu({ title: cat.label, items: cat.items });
    if (chosen) handleItem(chosen);
  };
  categoryRow.appendChild(button);
});

// ================= TASK SYSTEM =================
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const STORAGE_KEY = "qfm_remarks_tasks";
const HISTORY_KEY = "qfm_remarks_history";

// Load tasks on startup
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  taskList.innerHTML = "";
  tasks.forEach((task, index) => renderTask(task, index));
}

// Save tasks
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render one task
function renderTask(task, index) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.draggable = true;
  li.dataset.index = index;

  if (task.restored) {
    li.classList.add("restored");
  }

  li.innerHTML = `
    <div class="task-text" contenteditable="true" data-index="${index}">${task.text}</div>
    <div class="task-meta">
      <span class="task-time">${task.time}</span>
      <button data-index="${index}">🗑️</button>
    </div>
  `;

  // Drag events
  li.addEventListener("dragstart", (e) => {
    li.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  });

  li.addEventListener("dragend", () => {
    document.querySelectorAll(".task-item").forEach(el => {
      el.classList.remove("dragging", "drag-over");
    });
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    document.querySelectorAll(".task-item").forEach(el => el.classList.remove("drag-over"));
    li.classList.add("drag-over");
  });

  li.addEventListener("drop", (e) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const toIndex = parseInt(li.dataset.index);
    if (fromIndex === toIndex) return;

    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const [moved] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, moved);
    saveTasks(tasks);
    loadTasks();
  });

  taskList.appendChild(li);
}

// ===== Add task (Shift + Enter) =====
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey && taskInput.value.trim() !== "") {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const now = new Date().toLocaleString("en-GB", { hour12: false });

    tasks.push({ text: taskInput.value, time: now });
    saveTasks(tasks);

    // render FIRST (critical)
    loadTasks();

    // reset textarea AFTER render
    taskInput.value = "";
    taskInput.blur();
    requestAnimationFrame(() => {
      taskInput.focus();
      taskInput.scrollTop = 0;
    });
  }
});

// ===== Save edits on blur =====
taskList.addEventListener("focusout", (e) => {
  if (e.target.classList.contains("task-text")) {
    const index = e.target.dataset.index;
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    tasks[index].text = e.target.innerText;
    saveTasks(tasks);
  }
});

// ===== Delete task (store in history) =====
taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const index = e.target.dataset.index;
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    const removed = tasks.splice(index, 1)[0];

    history.push({
      ...removed,
      deletedAt: new Date().toLocaleString("en-GB", { hour12: false })
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    saveTasks(tasks);
    loadTasks();
  }
});

// ===== Restore latest deleted task =====
document.getElementById("restoreHistory").onclick = () => {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  if (!history.length) return;

  const restored = history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  tasks.push({
    text: restored.text,
    time: restored.time + " • restored",
    restored: true
  });

  saveTasks(tasks);
  loadTasks();
};

// ===== Clear history ONLY =====
document.getElementById("clearHistory").onclick = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// Initial load
loadTasks();

// Settings
initSettings();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('settings-overlay');
    if (overlay.classList.contains('open')) {
      closeSettings();
    } else {
      openSettings();
    }
  }
});
