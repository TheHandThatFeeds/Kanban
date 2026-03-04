import { updateStorage } from "./storage.mjs";

// This module handles the functionality related to moving task cards to a "trash"
// area, restoring them from the trash, and permanently deleting them.
// It also provides controls for these actions on each task card.
function getTrashList() {
  return document.getElementById("trashList");
}

export function moveToTrash(taskCard) {
  const trashList = getTrashList();
  if (!trashList) return;

  const parent = taskCard.parentElement;
  if (parent && parent.id) taskCard.dataset.prevParentId = parent.id;

  taskCard.classList.add("in-trash");
  trashList.appendChild(taskCard);
  updateStorage(); // uppdatera LS här
}

// This function is called when the "Lägg till" button is clicked.
// It checks if the input fields for the task title and description already exist.
// If they do, it retrieves their values, validates that the title is not empty,
// and then creates a new task card with the provided title and description.
// After creating the task card, it removes the input fields from the DOM.
export function restoreFromTrash(taskCard) {
  const prevParentId = taskCard.dataset.prevParentId;
  const prevParent = prevParentId
    ? document.getElementById(prevParentId)
    : null;
  const fallback = document.querySelector("inputDiv");

  taskCard.classList.remove("in-trash");
  // (prevParent || fallback)?.appendChild(taskCard);
  const targetParent = prevParent || fallback;
  if (targetParent) {
    targetParent.appendChild(taskCard);
  }

  delete taskCard.dataset.prevParentId;
  // Updates the delete button to show delete icon when restored from trash
  const deleteBtn = taskCard.querySelector(".delete-task-btn");
  if (deleteBtn) {
    deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
  }
}

export function deleteForever(taskCard) {
  if (confirm("Är du säker att du vill radera kortet permanent?")) {
    taskCard.remove();
    updateStorage(); // uppdatera LS
  }
}

// This function attaches the necessary controls (buttons) to a task card for moving it to the trash, restoring it from the trash, and permanently deleting it.
// It creates a delete button that toggles between moving the card to the trash and restoring it, and a permanent delete button that removes the card from the DOM entirely.
// These buttons are appended to the specified controls container, which defaults to the task card itself if not provided.
const emptyTrashBtn = document.getElementById("emptyTrashBtn");

function emptyTrash() {
  const trashList = getTrashList();
  if (!trashList) return;

  if (
    confirm(
      "Är du säker att du vill tömma papperskorgen? Alla kort i papperskorgen kommer att raderas permanent.",
    )
  ) {
    while (trashList.firstChild) {
      // Loop through all child nodes of the trash list and remove them one by one until the trash list is empty.
      trashList.firstChild.remove();
    }
  }
}

if (emptyTrashBtn) {
  emptyTrashBtn.addEventListener("click", emptyTrash);
}

// This function creates the input fields for adding a new task, along with "Lägg till" and "Avbryt" buttons.
// It appends these elements to a form container and inserts the container into the DOM.
// The "Lägg till" button is set up to call the taskBtn function again to handle the submission of the new task,
// while the "Avbryt" button calls the removeInputFields function to remove the input fields from the DOM.
export function attachTrashControls(taskCard, controlsContainer = taskCard) {
  const footer = taskCard.querySelector(".task-footer");
  const targetContainer = footer || controlsContainer;

  // Delete / Restore button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-task-btn";
  deleteBtn.setAttribute("aria-label", "Radera");
  deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (taskCard.classList.contains("in-trash")) {
      restoreFromTrash(taskCard);
      deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
    } else {
      moveToTrash(taskCard);
      deleteBtn.innerHTML = '<ion-icon name="arrow-undo-outline"></ion-icon>';
      updateStorage(); // Uppdatera LS
    }
  });

  controlsContainer.appendChild(deleteBtn);

  // Permanent delete button
  const permanentBtn = document.createElement("button");
  permanentBtn.className = "permanent-delete-btn";
  permanentBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
  permanentBtn.setAttribute("aria-label", "Radera permanent");

  permanentBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteForever(taskCard);
  });

  controlsContainer.appendChild(permanentBtn);
}
