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

const addBtn = document.querySelector('taskBtn')
//const addInput = document.querySelector('taskInput')
const addList = document.querySelector('taskList')

function taskBtn() {
  const taskInput = document.createInputElement('input'); // Create a new input element for the task input field.
  const taskText = taskInput.value.trim(); // Get the value from the input filed and remove any white spaces.
  if (taskText !== '') { // Check inf the input is not empty. 
      createTaskElement(taskText); // This function will create will create a new task item based on the value from the input field. 
      taskInput.value = ''; // clear the input field after creating the task item.
  } else {
      alert('Var god och skriv en uppgift...'); // If the input is empty, alert the user to enter a task. 
  }
}

addBtn.addEventListener('click', taskBtn); // A task item will be created based on the value from the input field once the add button is clicked.

function createTaskElement(taskText) {
  const listItem = document.createElement('li'); // Create a new list item element to repreent the task.
  listItem.textContent = taskText; // Set the text content of the list item to taskText wich is the value fron the input field. 
  addList.appendChild(listItem); // Append the new list item to the task list.
}