import copyingText from "./functions/copyingText.js";
import { initSettings, openSettings, closeSettings } from "./functions/settings.js";
import {
  extensionOnly,
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

// ================= BUTTON SCRIPTS =================
document.querySelectorAll('.item').forEach(item => {
  item.onclick = () => {
    const allowedExtensionOnly = ["doorAccess", "tooHot", "tooCold", "toiletClogged", "lights", "lightsDark", "aprDeactivate", "aprActivate"];
    const allowedNameOnly = ["remarksAssignedJciGen", "remarksNotifiedJciGen", "remarksTemp"];
    const allowedExternalDepartments = ["biomed", "humberIt", "ge"];
    const allowedCodeIds = ["codeLine", "nc"];

    if (allowedExtensionOnly.includes(item.id)) {
      extensionOnly(allScripts[item.id]);
    }
    else if (allowedExternalDepartments.includes(item.id)) {
      externalDepartments(allScripts[item.id], item.id);
    }
    else if (allowedNameOnly.includes(item.id)) {
      nameOnly(allScripts[item.id], item.id);
    }
    else if (item.id === "terminalClean") {
      terminalClean(allScripts[item.id]);
    }
    else if (item.id === "trash" || item.id === "linen") {
      trashLinen(allScripts[item.id]);
    }
    else if (item.id === "agv") {
      agv(allScripts[item.id]);
    }
    else if (item.id === "alarmFormatter") {
      alarmFormatter();
    }
    else if (allowedCodeIds.includes(item.id)) {
      codes(allScripts[item.id], item.id);
    }
    else if (item.id === "remarksCode") {
      codeRemarks(allScripts[item.id]);
    }
    else if (item.id === "remarksGe") {
      geRemarks(allScripts[item.id]);
    }
    else if (item.id === "remarksHrhIt") {
      hrhItRemarks(allScripts[item.id]);
    }
    else if (item.id === "remarksAsPer") {
      asPerRemarks();
    }
    else if (item.id=="remarksClearCode") {
      clearCodeRemarks(allScripts[item.id]);
    }
    else {
      copyingText(allScripts[item.id]);
    }
  };
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
