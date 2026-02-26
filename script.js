// Funktion för att ladda in fån Ionicons CDN
function loadIonicons() {
  // ESM-versionen (för moderna webbläsare) ESM = EcmaScript Module gör så att man kan importera och exportera moduler i JavaScript från externa filer
  const scriptModule = document.createElement('script'); // Skapa ett script-element
  scriptModule.type = 'module'; // Sätt typ till module för att ladda ESM-versionen, vilket gör att den kan importeras som en modul i JavaScript
  scriptModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'; // Sätt källan till ESM-versionen av Ionicons, sourcen är en CDN-länk som pekar på den senaste versionen av Ionicons
  document.head.appendChild(scriptModule); // Lägg till script-elementet i dokumentets head för att ladda det

  // Nomodule-versionen (för äldre webbläsare)
  const scriptNoModule = document.createElement('script');
  scriptNoModule.setAttribute('nomodule', ''); // Sätt nomodule-attributet för att indikera att detta script endast ska laddas i webbläsare som inte stödjer ESM
  scriptNoModule.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
  document.head.appendChild(scriptNoModule); // Lägg till nomodule-versionen av Ionicons i dokumentets head, vilket säkerställer att äldre webbläsare också kan använda ikonerna
}

loadIonicons();

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
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-task-btn';
  deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>'; 
  deleteBtn.onclick = function() {
    taskCard.remove(); // Remove the task card when delete button is clicked
  };
  taskCard.appendChild(deleteBtn);
  
  // Create title element
  const title = document.createElement('h3');
  title.className = 'task-title';
  title.textContent = titleText;
  taskCard.appendChild(title);
  
  // Create description element if there's text
  if (descText !== '') {
    const description = document.createElement('p');
    description.className = 'task-description';
    description.textContent = descText;
    taskCard.appendChild(description);
  }
  
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
  e.dataTransfer.setData('text/html', this.innerHTML); 
}

function handleDragEnd(e) {
  this.style.opacity = '1';
}
