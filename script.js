import { attachTrashControls } from "./modules/delete.mjs";
import { attachEditControls } from "./modules/edit.mjs";
import { setDragEvents, setupAllDroppableAreas, getDragVisual } from "./modules/move.mjs";

const addButtons = document.querySelectorAll('#taskBtn');


// When the page loading the drop zones are setup and ready to use
document.addEventListener('DOMContentLoaded', () => {
  setupAllDroppableAreas();
});

// This function will be called when any "Lägg till" button is clicked.
function createTaskHandler(inputDiv) {
  return function taskBtn() {
    const taskTitle = inputDiv.querySelector('#taskTitle');
    const taskDescription = inputDiv.querySelector('#taskDescription');

    // If inputs do not exist yet, create them
    if (!taskTitle || !taskDescription) {
      createInputFields(inputDiv);
      return;
    }

    const titleText = taskTitle.value.trim();
    const descText = taskDescription.value.trim();

    if (titleText === '') {
      alert('Var god och skriv en uppgift...');
      return;
    }

    createTaskElement(titleText, descText, inputDiv);
    removeInputFields(inputDiv);
  }
}

function createInputFields(inputDiv) {
  const existingForm = inputDiv.querySelector('#taskFormContainer');
  if (existingForm) {
    return;
  }

  // Create title input
  const taskTitle = document.createElement('input');
  taskTitle.type = 'text';
  taskTitle.id = 'taskTitle';
  taskTitle.placeholder = 'Uppgiftens titel...';

  // Create description textarea
  const taskDescription = document.createElement('textarea');
  taskDescription.id = 'taskDescription';
  taskDescription.placeholder = 'Beskrivning...';
  taskDescription.rows = 3; // Set number of rows for the textarea

  // Create submit button
  const submitBtn = document.createElement('button');
  submitBtn.id = 'submitTaskBtn';
  submitBtn.textContent = 'Lägg till';
  submitBtn.onclick = createTaskHandler(inputDiv); // Call handler again with correct inputDiv

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancelTaskBtn';
  cancelBtn.textContent = 'Avbryt';
  cancelBtn.onclick = () => removeInputFields(inputDiv);

  // Create form container wich is a div to hold the input fields and buttons
  const formContainer = document.createElement('div'); // Located in the taskBtn function, this creates a new div element that will serve as a container for the input fields and buttons
  formContainer.id = 'taskFormContainer';
  formContainer.appendChild(taskTitle); // Add the title input to the form container
  formContainer.appendChild(taskDescription); // Add the description textarea to the form container
  formContainer.appendChild(submitBtn); // Add the submit button to the form container
  formContainer.appendChild(cancelBtn); // Add the cancel button to the form container

  // Insert the form container at the beginning of inputDiv
  inputDiv.insertBefore(formContainer, inputDiv.firstChild);

}

// This function removes the input fields for creating a new task from the DOM.
function removeInputFields(inputDiv) {
  const formContainer = inputDiv.querySelector('#taskFormContainer');
  if (formContainer) {
    formContainer.remove();
  }
}

// Add click event listeners to all "Lägg till" buttons and pass the corresponding inputDiv to the handler function.
addButtons.forEach((button) => { // Loop through each button with id "taskBtn"
  const column = button.closest('div[id^="column"]'); // Find the closest parent div with an id that starts with "column"
  const inputDiv = column?.querySelector('#inputDiv'); // Find the inputDiv within that column

  if (!inputDiv) { 
    return;
  }

  button.addEventListener('click', createTaskHandler(inputDiv));
});

// This function creates a new task card element with the given title and description,
// and adds it to the specified inputDiv container.
// It also sets up the necessary event listeners for dragging and deleting the task card.
function createTaskElement(titleText, descText, inputDiv) {
  // Create a draggable task card
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
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
  timestamp.textContent = now.toLocaleString('sv-SE'); // Swedish date/time format
  footer.appendChild(timestamp);

  taskCard.appendChild(footer);

 // Create delete button
attachTrashControls(taskCard);

 // Create edit button
attachEditControls(taskCard, title, description)

// Setup drag and drop elements using move.mjs
setDragEvents(taskCard);
getDragVisual(taskCard);

  // // Add drag event listeners
  // taskCard.addEventListener('dragstart', handleDragStart);
  // taskCard.addEventListener('dragend', handleDragEnd);

  // Append the task card to the container
  inputDiv.appendChild(taskCard);
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
