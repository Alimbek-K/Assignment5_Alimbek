
const MAX_IN_PROGRESS = 3;

const tasks = [
    { id: 1, title: "Finish JavaScript homework", status: "todo", priority: 3, tag: "study", hours: 3 },
    { id: 2, title: "Prepare for exam", status: "progress", priority: 3, tag: "study", hours: 5 },
    { id: 3, title: "Create presentation", status: "todo", priority: 2, tag: "study", hours: 2 },
    { id: 4, title: "Update portfolio", status: "progress", priority: 2, tag: "work", hours: 4 },
    { id: 5, title: "Read programming book", status: "done", priority: 1, tag: "personal", hours: 2 },
    { id: 6, title: "Fix website bugs", status: "todo", priority: 3, tag: "work", hours: 4 },
    { id: 7, title: "Practice HTML forms", status: "done", priority: 2, tag: "study", hours: 2 },
    { id: 8, title: "Plan weekly schedule", status: "todo", priority: 1, tag: "personal", hours: 1 },
    { id: 9, title: "Review CSS Grid", status: "todo", priority: 2, tag: "study", hours: 2 },
    { id: 10, title: "Complete project report", status: "todo", priority: 3, tag: "work", hours: 3 }
];

const board = document.getElementById("kanbanBoard");
const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

const searchTask = document.getElementById("searchTask");
const tagFilter = document.getElementById("tagFilter");
const sortPriority = document.getElementById("sortPriority");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const boardMessage = document.getElementById("boardMessage");

function showMessage(message, type = "") {
    boardMessage.textContent = message;
    boardMessage.classList.remove("error", "success");

    if (type === "error" || type === "success") {
        boardMessage.classList.add(type);
    }
}

function getPriorityName(priority) {
    if (priority === 3) {
        return "High";
    } else if (priority === 2) {
        return "Medium";
    }

    return "Low";
}

function createTaskCard(task) {
    const card = document.createElement("article");
    card.classList.add("task-card");
    card.dataset.id = task.id;

    const title = document.createElement("h3");
    title.textContent = task.title;

    const details = document.createElement("p");
    details.textContent =
        "Priority: " + getPriorityName(task.priority) +
        " | Tag: " + task.tag +
        " | Hours: " + task.hours;

    const buttons = document.createElement("div");
    buttons.classList.add("task-buttons");

    if (task.status !== "todo") {
        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.textContent = "Back";
        backButton.dataset.action = "back";
        backButton.dataset.id = task.id;
        buttons.appendChild(backButton);
    }

    if (task.status !== "done") {
        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.textContent = "Next";
        nextButton.dataset.action = "next";
        nextButton.dataset.id = task.id;
        buttons.appendChild(nextButton);
    }

    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(buttons);

    return card;
}

function render() {
    todoTasks.replaceChildren();
    progressTasks.replaceChildren();
    doneTasks.replaceChildren();

    const search = searchTask.value.trim().toLowerCase();
    const selectedTag = tagFilter.value;
    const selectedSort = sortPriority.value;

    const visibleTasks = [];

    for (const task of tasks) {
        const matchesSearch =
            task.title.toLowerCase().includes(search);

        const matchesTag =
            selectedTag === "all" || task.tag === selectedTag;

        if (matchesSearch && matchesTag) {
            visibleTasks.push(task);
        }
    }

    if (selectedSort === "high") {
        visibleTasks.sort((a, b) => b.priority - a.priority);
    } else if (selectedSort === "low") {
        visibleTasks.sort((a, b) => a.priority - b.priority);
    } else {
        visibleTasks.sort((a, b) => a.id - b.id);
    }

    for (const task of visibleTasks) {
        const card = createTaskCard(task);

        if (task.status === "todo") {
            todoTasks.appendChild(card);
        } else if (task.status === "progress") {
            progressTasks.appendChild(card);
        } else if (task.status === "done") {
            doneTasks.appendChild(card);
        }
    }

    let completed = 0;
    let totalHours = 0;

    for (const task of tasks) {
        totalHours += task.hours;

        if (task.status === "done") {
            completed++;
        }
    }

    const percent = Math.round((completed / tasks.length) * 100);

    progressBar.value = percent;
    progressText.textContent =
        percent + "% completed | Total estimated hours: " + totalHours;

    if (visibleTasks.length === 0) {
        showMessage("No tasks found.", "error");
    } else if (boardMessage.textContent === "No tasks found.") {
        showMessage("");
    }
}

function moveTask(id, action) {
    const task = tasks.find(item => item.id === id);

    if (!task) {
        showMessage("Task not found.", "error");
        return;
    }

    if (action !== "next" && action !== "back") {
        showMessage("Invalid action.", "error");
        return;
    }

    let newStatus = task.status;

    if (action === "next") {
        if (task.status === "todo") {
            newStatus = "progress";
        } else if (task.status === "progress") {
            newStatus = "done";
        } else {
            showMessage("This task is already done.", "error");
            return;
        }
    } else if (action === "back") {
        if (task.status === "done") {
            newStatus = "progress";
        } else if (task.status === "progress") {
            newStatus = "todo";
        } else {
            showMessage("This task is already in To Do.", "error");
            return;
        }
    }

    if (newStatus === "progress") {
        let count = 0;

        for (const item of tasks) {
            if (item.status === "progress") {
                count++;
            }
        }

        if (count >= MAX_IN_PROGRESS) {
            showMessage(
                "In Progress can contain a maximum of 3 tasks.",
                "error"
            );
            return;
        }
    }

    task.status = newStatus;

    showMessage("Task moved successfully.", "success");
    render();
}

board.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button || !board.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    moveTask(id, action);
});

searchTask.addEventListener("input", render);
tagFilter.addEventListener("change", render);
sortPriority.addEventListener("change", render);

render();
