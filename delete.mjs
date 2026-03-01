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
}

// This function is called when the "Lägg till" button is clicked. 
// It checks if the input fields for the task title and description already exist. 
// If they do, it retrieves their values, validates that the title is not empty, 
// and then creates a new task card with the provided title and description. 
// After creating the task card, it removes the input fields from the DOM.
export function restoreFromTrash(taskCard) {
const prevParentId = taskCard.dataset.prevParentId;
const prevParent = prevParentId ? document.getElementById(prevParentId) : null;
const fallback = document.getElementById("inputDiv");

taskCard.classList.remove("in-trash");
(prevParent || fallback)?.appendChild(taskCard);

delete taskCard.dataset.prevParentId;
}

export function deleteForever(taskCard) {
if (confirm("Är du säker att du vill radera kortet permanent?")) {
    taskCard.remove();
}
}

export function attachTrashControls(taskCard) {
  // Delete / restore button
const deleteBtn = document.createElement("button");
deleteBtn.className = "delete-task-btn";
deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';

deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

if (taskCard.classList.contains("in-trash")) {
    restoreFromTrash(taskCard);
    deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
    } else {
    moveToTrash(taskCard);
    deleteBtn.innerHTML = '<ion-icon name="arrow-undo-outline"></ion-icon>';
    }
});

taskCard.appendChild(deleteBtn);

  // Permanent delete button
const permanentBtn = document.createElement("button");
permanentBtn.className = "permanent-delete-btn";
permanentBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
permanentBtn.setAttribute("aria-label", "Radera permanent");

permanentBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteForever(taskCard);
});

taskCard.appendChild(permanentBtn);
}