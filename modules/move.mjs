import { updateStorage } from "./storage.mjs";

let draggedElement = null;
let sourceColumn = null;

export function setDragEvents(taskCard) {
  taskCard.addEventListener("dragstart", handleDragStart);
  taskCard.addEventListener("dragend", handleDragEnd);
}

// VIKTIGT: Denna funktion måste exporteras även om den är tom!
export function getDragVisual(taskCard) {
  // Visual feedback is now handled in handleDragStart and handleDragEnd
  // No need for separate event listeners
}

export function setupAllDroppableAreas() {
  const inputDivs = document.querySelectorAll('[id^="inputDiv"]');
  const droppableAreas = [...inputDivs, document.getElementById("trashList")];

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

  console.log("🟢 Drag started from:", sourceColumn?.id);
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

function setupDroppableAreas(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    column.classList.add("drag-over");

    if (!draggedElement || !draggedElement.classList.contains("task-card")) {
      return;
    }

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

    console.log("🔵 Dropped into:", column.id);
    console.log("🔵 Source was:", sourceColumn?.id);

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
        console.log("✅ Restored from trash");
      } else {
        // Moving between normal columns - update prevParentId
        if (column.id && column.id.startsWith("inputDiv")) {
          draggedElement.dataset.prevParentId = column.id;
          console.log("✅ Updated prevParentId to:", column.id);
        }
      }
    }
    updateStorage(); // uppdatera ls
  });
}

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

// When drag starts, add a class to the element for visual feedback
export function getDragVisual(taskCard) {
  taskCard.addEventListener("dragstart", function () {
    this.classList.add("dragging");
  });

  taskCard.addEventListener("dragend", function () {
    this.classList.remove("dragging");
  });
}
