import { attachTrashControls } from "./delete.mjs";
import { attachEditControls } from "./edit.mjs";

const addBtn = document.querySelector('#taskBtn')
const inputDiv = document.querySelector('#inputDiv')

// This function will be called when the "Lägg till" button is clicked.
function taskBtn() {
  const taskTitle = document.querySelector('#taskTitle');
  const taskDescription = document.querySelector('#taskDescription');

  // If inputs do not exist yet, create them
  if (!taskTitle || !taskDescription) {
    createInputFields();
    return;
  }

  const titleText = taskTitle.value.trim();
  const descText = taskDescription.value.trim();

  if (titleText === '') {
    alert('Var god och skriv en uppgift...');
    return;
  }

  createTaskElement(titleText, descText);
  removeInputFields();
}

function createInputFields() {
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
  submitBtn.onclick = taskBtn; // Call taskBtn again to handle submission after creating input fields

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancelTaskBtn';
  cancelBtn.textContent = 'Avbryt';
  cancelBtn.onclick = removeInputFields;

  // Create form container wich is a div to hold the input fields and buttons
  const formContainer = document.createElement('div'); // Located in the taskBtn function, this creates a new div element that will serve as a container for the input fields and buttons
  formContainer.id = 'taskFormContainer';
  formContainer.appendChild(taskTitle); // Add the title input to the form container
  formContainer.appendChild(taskDescription); // Add the description textarea to the form container
  formContainer.appendChild(submitBtn); // Add the submit button to the form container
  formContainer.appendChild(cancelBtn); // Add the cancel button to the form container

  // Insert at the beginning of inputDiv
  inputDiv.insertBefore(formContainer, inputDiv.firstChild);
}

function removeInputFields() {
  const formContainer = document.querySelector('#taskFormContainer');
  if (formContainer) {
    formContainer.remove();
  }
}

addBtn.addEventListener('click', taskBtn);

// This function creates a new task card element with the given title and description, and adds it to the inputDiv container. It also sets up the necessary event listeners for dragging and deleting the task card.
function createTaskElement(titleText, descText) {
  // Create a draggable task card
  const taskCard = document.createElement('div');
  taskCard.className = 'task-card';
  taskCard.draggable = true; // Make the div draggable

 // Create delete button
attachTrashControls(taskCard);

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

 // Create edit button
attachEditControls(taskCard, title, description)

  // Add drag event listeners
  taskCard.addEventListener('dragstart', handleDragStart);
  taskCard.addEventListener('dragend', handleDragEnd);

  // Append the task card to the container
  inputDiv.appendChild(taskCard);
}

// Drag and drop event handlers
function handleDragStart(e) {
  this.style.opacity = '0.4';
  e.dataTransfer.effectAllowed = 'move'; 
  e.dataTransfer.setData('text/html', this.innerHTML); // Store the HTML content of the dragged element in the dataTransfer object, which allows it to be accessed during the drop event to move the task card to a new location
}

function handleDragEnd(e) {
  this.style.opacity = '1';
}
