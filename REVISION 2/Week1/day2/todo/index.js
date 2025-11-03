const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const allTasks = document.getElementById("allTasks");
const clearBtn=document.getElementById("clearBtn")

let tasks = [];
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click",clearTasks)
function addTask() {
  let input = taskInput.value.trim();
  if (input) tasks.push({ id: Date.now(), title: input, completed: false });
  taskInput.value = "";
  displayTasks();
}

function clearTasks(){
tasks=tasks.filter(t=>t.completed!=true)
displayTasks()
}

function displayTasks() {
  allTasks.innerHTML = "";
  tasks.forEach((task) => {
    let div = document.createElement("div");
    div.innerHTML = `
        <span style="text-decoration:${
          task.completed ? "line-through" : "none"
        };cursor:pointer;">${task.title}</span>
        <button class="deleteBtn">🗑️</button>
        `;

    let deleteBtn = div.querySelector(".deleteBtn");
    let span = div.querySelector("span");
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id != task.id);
      displayTasks();
    });

    span.addEventListener("click", () => {
      task.completed = !task.completed;
      displayTasks();
    });
    allTasks.appendChild(div);
  });
}
