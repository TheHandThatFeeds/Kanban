import { attachTrashControls } from "./modules/delete.mjs";
import { attachEditControls } from "./modules/edit.mjs";
import {
  setDragEvents,
  setupAllDroppableAreas,
  getDragVisual,
} from "./modules/move.mjs";
import { loadTasks, updateStorage } from "./modules/storage.mjs";

const addBtn = document.querySelector("#taskBtn");
const inputDiv = document.querySelector("#inputDiv");

// When the page loading the drop zones are setup and ready to use
document.addEventListener("DOMContentLoaded", () => {
  setupAllDroppableAreas();

  // load tasks on "startup"
  const savedTasks = loadTasks();
  savedTasks.forEach((t) => {
    createTaskElement(t.title, t.description, t.timestamp, t.columnId);
  });
});
// This function will be called when the "Lägg till" button is clicked.
function taskBtn() {
  const taskTitle = document.querySelector("#taskTitle");
  const taskDescription = document.querySelector("#taskDescription");

  // If inputs do not exist yet, create them
  if (!taskTitle || !taskDescription) {
    createInputFields(inputDiv);
    return;
  }

  const titleText = taskTitle.value.trim();
  const descText = taskDescription.value.trim();

  if (titleText === "") {
    alert("Var god och skriv en uppgift...");
    return;
  }

  createTaskElement(titleText, descText, inputDiv);
  removeInputFields(inputDiv);
}

function createInputFields(inputDiv) {
  const existingForm = inputDiv.querySelector("#taskFormContainer");
  if (existingForm) {
    return;
  }

  // Create title input
  const taskTitle = document.createElement("input");
  taskTitle.type = "text";
  taskTitle.id = "taskTitle";
  taskTitle.placeholder = "Uppgiftens titel...";

  // Create description textarea
  const taskDescription = document.createElement("textarea");
  taskDescription.id = "taskDescription";
  taskDescription.placeholder = "Beskrivning...";
  taskDescription.rows = 3; // Set number of rows for the textarea

  // Create submit button
  const submitBtn = document.createElement("button");
  submitBtn.id = "submitTaskBtn";
  submitBtn.textContent = "Lägg till";
  submitBtn.onclick = createTaskHandler(inputDiv); // Call handler again with correct inputDiv

  // Create cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelTaskBtn";
  cancelBtn.textContent = "Avbryt";
  cancelBtn.onclick = () => removeInputFields(inputDiv);

  // Create form container wich is a div to hold the input fields and buttons
  const formContainer = document.createElement("div"); // Located in the taskBtn function, this creates a new div element that will serve as a container for the input fields and buttons
  formContainer.id = "taskFormContainer";
  formContainer.appendChild(taskTitle); // Add the title input to the form container
  formContainer.appendChild(taskDescription); // Add the description textarea to the form container
  formContainer.appendChild(submitBtn); // Add the submit button to the form container
  formContainer.appendChild(cancelBtn); // Add the cancel button to the form container

  // Insert the form container at the beginning of inputDiv
  inputDiv.insertBefore(formContainer, inputDiv.firstChild);
}

// This function removes the input fields for creating a new task from the DOM.
function removeInputFields(inputDiv) {
  const formContainer = inputDiv.querySelector("#taskFormContainer");
  if (formContainer) {
    formContainer.remove();
  }
}

// Add click event listeners to all "Lägg till" buttons and pass the corresponding inputDiv to the handler function.
addButtons.forEach((button) => {
  // Loop through each button with id "taskBtn"
  const column = button.closest('div[id^="column"]'); // Find the closest parent div with an id that starts with "column"
  const inputDiv = column?.querySelector('[id^="inputDiv"]'); // Find all the inputDiv that starts with inputDiv. Changed the id in HTML files to inputDiv-column1, inputDiv-column2 etc. to make it possible to have multiple inputDivs for each column. This line finds the correct inputDiv for the clicked button.

  if (!inputDiv) {
    return;
  }

  button.addEventListener("click", createTaskHandler(inputDiv));
});

// This function creates a new task card element with the given title and description,
// and adds it to the specified inputDiv container.
// It also sets up the necessary event listeners for dragging and deleting the task card.

// change:
function createTaskElement(
  titleText,
  descText,
  timeText = null,
  targetId = "inputDiv",
) {
  // Create a draggable task card
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.draggable = true; // Make the div draggable

  // Create title element
  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = titleText;
  taskCard.appendChild(title);

  // Create description element even if empty (to make edit work)
  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = descText; // kan vara tomt
  taskCard.appendChild(description);

  // Create footer container for timestamp and buttons
  const footer = document.createElement("div");
  footer.className = "task-footer";

  // Create timestamp element
  const timestamp = document.createElement("span");
  timestamp.className = "task-timestamp";
  const now = new Date();
  timestamp.textContent = now.toLocaleString("sv-SE"); // Swedish date/time format
  footer.appendChild(timestamp);

  taskCard.appendChild(footer);

  // Create delete button
  attachTrashControls(taskCard);

  // Create edit button
  attachEditControls(taskCard, title, description);

  // Setup drag and drop elements using move.mjs
  setDragEvents(taskCard);
  getDragVisual(taskCard);

  // // Add drag event listeners
  // taskCard.addEventListener('dragstart', handleDragStart);
  // taskCard.addEventListener('dragend', handleDragEnd);

  // timestamp
  timestamp.textContent = timeText || new Date().toLocaleString("sv-SE");

  // Append the task card to the container
  // inputDiv.appendChild(taskCard);

  // Changed the append line to use the targetid
  const targetColumn = document.getElementById(targetId);
  targetColumn.appendChild(taskCard);

  // If loading into trash, apply the css and update the button icon (Previous bug)
  if (targetId === "trashList") {
    taskCard.classList.add("in-trash");
    const deleteBtn = taskCard.querySelector(".delete-task-btn");
    if (deleteBtn) {
      deleteBtn.innerHTML = '<ion-icon name="arrow-undo-outline"></ion-icon>';
    }
  }

  // Update ls storage after creation & appended
  updateStorage();
}

// // Drag and drop event handlers
// function handleDragStart(e) {
//   this.style.opacity = '0.4';
//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', this.innerHTML);
// }

// function handleDragEnd(e) {
//   this.style.opacity = '1';
// }
