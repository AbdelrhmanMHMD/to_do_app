let input = document.querySelector(".task-adder input");
let addBtn = document.querySelector(".task-adder button");
let taskList = document.querySelector(".task-list");
let tasksArr = [];
let emptyTaskList = `<div style="text-align:center;font-size:20px;">No tasks today</div>`;

getTasksFromLocal();

// adding tasks to the task list
addTasksToList(tasksArr);

// dirct focus on input when reload
input.focus();

// check if there is tasks
function noTasks() {
	if (taskList.innerHTML == "") {
		taskList.innerHTML = emptyTaskList;
	}
}
noTasks();

// make enter key add tasks
document.onkeyup = function (e) {
	if (e.key == "Enter") {
		addBtn.click();
	}
};

addBtn.onclick = function () {
	if (input.value != "") {
		// Capitalize the task title
		let taskTitle = input.value;
		let firstL = taskTitle.charAt(0).toUpperCase();
		taskTitle = firstL + taskTitle.slice(1);

		// calling the creating task function
		addTask(taskTitle);

		// empty the input field
		input.value = "";

		// focus in input
		input.focus();
	}
};

// collecting task info
function addTask(taskTitle) {
	// creating a task in object
	const task = {
		id: Date.now(),
		title: taskTitle,
		completed: false,
	};

	// adding task to the arr of tasks
	tasksArr.push(task);

	// adding tasks to localStorage
	addTasksToLocal(tasksArr);

	// adding tasks to the task list
	addTasksToList(tasksArr);
}

function addTasksToList(arr) {
	// empty task list div
	taskList.innerHTML = "";

	// looping on tasks arr
	arr.forEach((task) => {
		// creating the main div
		let div = document.createElement("div");
		div.appendChild(document.createTextNode(task.title));
		div.className = "task";
		if (task.completed) {
			div.className = "task done";
		}
		div.dataset.id = task.id;

		// creating the Btns div
		let btnsDiv = document.createElement("div");

		// creating the done btn
		let doneBtn = document.createElement("span");

		if (div.classList.contains("done")) {
			doneBtn.appendChild(document.createTextNode("reset"));
		} else {
			doneBtn.appendChild(document.createTextNode("Done"));
		}

		doneBtn.className = "finish";
		btnsDiv.append(doneBtn);

		// adding the finish event to done btn
		doneBtn.addEventListener("click", (e) => {
			div.classList.toggle("done");
			div.classList.contains("done")
				? (e.target.innerHTML = "reset")
				: (e.target.innerHTML = "Done");
			tasksArr.forEach((task) => {
				if (task.id == +div.dataset.id) {
					task.completed == false
						? (task.completed = true)
						: (task.completed = false);
				}
			});
			addTasksToLocal(tasksArr);
		});

		// creating the delete btn
		let span = document.createElement("span");
		span.appendChild(document.createTextNode("X"));
		span.className = "del";
		btnsDiv.append(span);
		// add deleting event to delete btn
		span.addEventListener("click", (e) => {
			e.target.parentElement.parentElement.remove();

			// remove the removed task from localStorage
			removeTaskFromLocal(+div.dataset.id);

			// check if there is tasks
			noTasks();
		});

		// adding the tasks to task list div
		div.append(btnsDiv);
		taskList.append(div);
	});
}

function addTasksToLocal(arr) {
	localStorage.setItem("tasks", JSON.stringify(arr));
}
function getTasksFromLocal() {
	let tasksInLocal = localStorage.getItem("tasks");
	if (tasksInLocal != null) {
		tasksArr = JSON.parse(tasksInLocal);
	}
}
function removeTaskFromLocal(taskId) {
	tasksArr = tasksArr.filter((task) => task.id != taskId);
	addTasksToLocal(tasksArr);
}

// declare controls
let delAllBtn = document.querySelector(".controls .del-all");
let doneAllBtn = document.querySelector(".controls .done-all");
let resetAllBtn = document.querySelector(".controls .reset-all");

// delete-all btn event
delAllBtn.onclick = function () {
	// empty tasks list
	taskList.innerHTML = emptyTaskList;

	// delete tasks from localstorage
	tasksArr = [];
	addTasksToLocal(tasksArr);
};

// done-all btn event
doneAllBtn.onclick = function () {
	// check if there is tasks or not
	if (taskList.innerHTML != emptyTaskList) {
		// loop on tasks
		document.querySelectorAll(".task-list .task").forEach((taskDiv) => {
			// adding class 'done' to taskDiv
			taskDiv.classList.add("done");

			// change done btn to reset btn
			taskDiv.querySelector(".finish").innerHTML = "reset";

			// save changs in localStorage
			tasksArr.forEach((task) => {
				task.completed = true;
			});
			addTasksToLocal(tasksArr);
		});
	}
};

// reset-all btn event
resetAllBtn.onclick = function () {
	// check if there is tasks or not
	if (taskList.innerHTML != emptyTaskList) {
		// loop on tasks
		document.querySelectorAll(".task-list .task").forEach((taskDiv) => {
			// removing class 'done' from taskDiv
			taskDiv.classList.remove("done");

			// change done btn to reset btn
			taskDiv.querySelector(".finish").innerHTML = "Done";

			// save changs in localStorage
			tasksArr.forEach((task) => {
				task.completed = false;
			});
			addTasksToLocal(tasksArr);
		});
	}
};
