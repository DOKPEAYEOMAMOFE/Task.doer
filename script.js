
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearCompletedButton = document.getElementById("clear-completed");

// Load previously saved tasks, or start with an empty array.
let tasks = [];

try {
    const savedTasks = localStorage.getItem("myTasks");

    if (savedTasks !== null) {
        const parsedTasks = JSON.parse(savedTasks);

        // Make sure the saved data has the expected structure.
        if (
            Array.isArray(parsedTasks) &&
            parsedTasks.every(task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            )
        ) {
            tasks = parsedTasks;
        }
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

// Save our current tasks in the browser.
function saveTasks() {
    try {
        localStorage.setItem("myTasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
        alert("Your changes could not be saved in this browser.");
    }
}

// Display the tasks on the page.
function renderTasks() {
    // Remove the previous list before drawing it again.
    taskList.replaceChildren();

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create the checkbox.
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );

        // Update a task when its checkbox changes.
        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Display the task text safely as text, not HTML.
        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        // Create the delete button.
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    // Count only tasks that are not completed.
    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${remainingTasks} task${remainingTasks === 1 ? "" : "s"} remaining`;
}

// Add a new task when the form is submitted.
taskForm.addEventListener("submit", event => {
    // Prevent the form from refreshing the page.
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Do not allow an empty task.
    if (taskText === "") {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    renderTasks();

    // Empty the input after adding the task.
    taskInput.value = "";
    taskInput.focus();
});

// Remove every completed task.
clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

// Display the saved tasks when the page first opens.
renderTasks();
