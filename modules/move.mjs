import { updateStorage } from "./storage.mjs";

let draggedElement = null;
let sourceColumn = null;

export function setDragEvents(taskCard) {
  taskCard.addEventListener("dragstart", handleDragStart);
  taskCard.addEventListener("dragend", handleDragEnd);
}

export function getDragVisual(taskCard) {
// Visual feedback is now handled in handleDragStart and handleDragEnd
}
// This module manages the drag-and-drop functionality for task cards, allowing users to move cards between columns and to the trash. It sets up event listeners for drag events and defines the behavior for dragging, dropping, and providing visual feedback during these interactions.
export function setupAllDroppableAreas() {
  const inputDivs = document.querySelectorAll('[id^="inputDiv"]');
  const droppableAreas = [...inputDivs, document.getElementById("trashList")];
// Ensure all droppable areas are valid before setting up event listeners
  droppableAreas.forEach((area) => {
    if (area) {
      setupDroppableAreas(area);
    }
  });
}

function handleDragStart(e) {
  draggedElement = this;
  sourceColumn = this.parentElement; // Save the original column before dragging
  this.style.opacity = "0.5";
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function handleDragEnd(e) {
  this.style.opacity = "1";
  this.classList.remove("dragging");
  document.querySelectorAll(".drag-over").forEach((area) => {
    area.classList.remove("drag-over");
  });

  sourceColumn = null; // Clear after drag ends
  draggedElement = null;
}
// This function sets up the necessary event listeners for a given column to allow it to accept dragged task cards. It handles the dragover, dragleave, and drop events to manage the visual feedback and the logic for moving cards between columns and to/from the trash.
function setupDroppableAreas(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    column.classList.add("drag-over");

    if (!draggedElement || !draggedElement.classList.contains("task-card")) {
      return;
    }
// Determine the position to insert the dragged element based on the mouse Y coordinate
    const afterElement = getDragAfterElement(column, e.clientY);
    if (afterElement == null) {
      column.appendChild(draggedElement);
    } else {
      column.insertBefore(draggedElement, afterElement);
    }
  });

  column.addEventListener("dragleave", (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");

    if (!draggedElement) return;

    if (column.id === "trashList") {
      // Moving to trash
      if (!draggedElement.classList.contains("in-trash")) {
        if (sourceColumn && sourceColumn.id) {
          draggedElement.dataset.prevParentId = sourceColumn.id;
          console.log("✅ Saved prevParentId:", sourceColumn.id);
        }
        draggedElement.classList.add("in-trash");

        const deleteBtn = draggedElement.querySelector(".delete-task-btn");
        if (deleteBtn) {
          deleteBtn.innerHTML =
            '<ion-icon name="arrow-undo-outline"></ion-icon>';
        }
      }
    } else {
      // Moving to a normal column
      if (draggedElement.classList.contains("in-trash")) {
        // Restoring from trash
        draggedElement.classList.remove("in-trash");
        delete draggedElement.dataset.prevParentId;

        const deleteBtn = draggedElement.querySelector(".delete-task-btn");
        if (deleteBtn) {
          deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        }
      } else {
        // Moving between normal columns - update prevParentId
        if (column.id && column.id.startsWith("inputDiv")) {
          draggedElement.dataset.prevParentId = column.id;
        }
      }
    }
    updateStorage(); // uppdatera ls
  });
}
// Helper function to get the element after which the dragged element should be placed
function getDragAfterElement(column, y) {
  const allTaskCards = column.querySelectorAll(".task-card:not(.dragging)");
  const draggableElements = [...allTaskCards];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
