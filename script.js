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

  // Titel input
  const taskTitle = document.createElement("input");
  taskTitle.type = "text";
  taskTitle.id = "taskTitle";
  taskTitle.placeholder = "Uppgiftens titel...";

  // Beskrivning textarea
  const taskDescription = document.createElement("textarea");
  taskDescription.id = "taskDescription";
  taskDescription.placeholder = "Beskrivning...";
  taskDescription.rows = 3; // Sätt antal rader för textarea

  // Lägg till knapp
  const submitBtn = document.createElement("button");
  submitBtn.id = "submitTaskBtn";
  submitBtn.textContent = "Lägg till";
  submitBtn.onclick = createTaskHandler(inputDiv);

  // Avbryt knapp
  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelTaskBtn";
  cancelBtn.textContent = "Avbryt";
  cancelBtn.onclick = () => removeInputFields(inputDiv);

  // En form container för att hålla alla input-fält och knappar
  const formContainer = document.createElement("div");
  formContainer.id = "taskFormContainer";
  formContainer.appendChild(taskTitle); // Lägg till titel input i form container
  formContainer.appendChild(taskDescription); // Lägg till beskrivning textarea i form container
  formContainer.appendChild(submitBtn); // Lägg till submit knapp i form container
  formContainer.appendChild(cancelBtn); // Lägg till cancel knapp i form container

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

// Denna function har till uppgift att alla div innehållande button taskBtn,
// för att sedan skapa en taskCard när knappen klickas.
addButtons.forEach((button) => {
  // Går igenom alla element som matchar id '#taskBtn' och lägger till en click-event listener på varje knapp
  const column = button.closest('div[id^="column"]'); // Hittar närmaste parent div som har ett id som börjar med "column" (dvs. den kolumn där knappen finns)
  const inputDiv = column?.querySelector("#inputDiv"); // Hittar inputDiv inom den kolumnen, här kommer task-korten att läggas till när de skapas

  if (!inputDiv) {
    return;
  }

  button.addEventListener("click", createTaskHandler(inputDiv));
});

// Denna function skapar ett nytt taskCard element med den angivna titeln och beskrivningen,
// och lägger till det i den angivna inputDiv containern.
// Den sätter också upp nödvändiga event listeners för att dra och ta bort task-kortet.

// change:
function createTaskElement(
  titleText,
  descText,
  timeText = null,
  targetId = "inputDiv",
) {
  // Skapa flyttbar task card element
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.draggable = true; // Gör task-kortet flyttbart med drag and drop genom att sätta draggable-attributet till true

  // Skapa titel element
  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = titleText;
  taskCard.appendChild(title);

  // Skapa beskrivning element även om det är tomt (för att göra redigering möjlig)
  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = descText; // kan vara tomt
  taskCard.appendChild(description);

  // Skapa footer container för tidsstämpel och knappar
  const footer = document.createElement("div");
  footer.className = "task-footer";

  // Skapa tidsstämpel element
  const timestamp = document.createElement("span");
  timestamp.className = "task-timestamp";
  const now = new Date();
  timestamp.textContent = now.toLocaleString("sv-SE"); // Swedish date/time format

  updateStorage(); // uppdatera localstorage

  footer.appendChild(timestamp);

  taskCard.appendChild(footer);

  // Radera knapp
  attachTrashControls(taskCard);

  // Redigeringsknapp
  attachEditControls(taskCard, title, description);

  setDragEvents(taskCard); // Sätt upp drag and drop event listeners på task-kortet
  getDragVisual(taskCard); // Preview baserat på task-kortets innehåll

  // Lägg till det nya task-kortet i inputDiv containern
  inputDiv.appendChild(taskCard);
}
