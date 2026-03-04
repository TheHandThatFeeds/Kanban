let draggedElement = null;

export function setDragEvents(taskCard) {
  taskCard.addEventListener("dragstart", handleDragStart);
  taskCard.addEventListener("dragend", handleDragEnd);
}

// Consolidated visual feedback for drag operations
export function getDragVisual(taskCard) {
  // Visual feedback is now handled in handleDragStart and handleDragEnd
  // No need for separate event listeners
}

// Setup droppable areas for columns and trash
export function setupAllDroppableAreas() {
  // Get all inputDiv containers (one per column)
  const inputDivs = document.querySelectorAll('#inputDiv');
  const droppableAreas = [
    ...inputDivs, // Add all inputDivs as droppable areas
    document.getElementById("trashList")
  ];

  droppableAreas.forEach(area => {
    if (area) {
      setupDroppableAreas(area);
    }
  });
}

// Drag start
function handleDragStart(e) {
  draggedElement = this;
  this.style.opacity = "0.5";
  this.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

// Drag end
function handleDragEnd(e) {
  this.style.opacity = "1";
  this.classList.remove("dragging");
  document.querySelectorAll(".drag-over").forEach(area => {
    area.classList.remove("drag-over");
  });
  draggedElement = null;
}

// Setup droppable areas for one column
function setupDroppableAreas(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    column.classList.add("drag-over");

    // Find where to insert the dragged element
    const afterElement = getDragAfterElement(column, e.clientY);
    if (afterElement == null) {
      column.appendChild(draggedElement);
    } else {
      column.insertBefore(draggedElement, afterElement);
    }
  });

  column.addEventListener("dragleave", (e) => {
    // Controls that we leave the column, not just a child element
    if (e.currentTarget.contains(e.relatedTarget)) return;
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");

    // Trash logic: if dropped in trash, mark as in-trash, otherwise remove that mark
    if (column.id === "trashList") {
      if (!draggedElement.classList.contains("in-trash")) {
        const parent = draggedElement.parentElement;
        if (parent && parent.id) {
          draggedElement.dataset.prevParentId = parent.id;
        }
        draggedElement.classList.add("in-trash");

        // Updates the delete button to show restore icon when moved to trash
        const deleteBtn = draggedElement.querySelector(".delete-task-btn");
        if (deleteBtn) {
          deleteBtn.innerHTML = '<ion-icon name="arrow-undo-outline"></ion-icon>';
        }
      }
    } else {
      // Reset from trash if the card is moved to a non-trash column
      if (draggedElement.classList.contains("in-trash")) {
        draggedElement.classList.remove("in-trash");
        delete draggedElement.dataset.prevParentId;

        // Reset delete button to show delete icon when moved out of trash
        const deleteBtn = draggedElement.querySelector(".delete-task-btn");
        if (deleteBtn) {
          deleteBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        }
      }
    }
  });
}

// Helper to find the element after which the dragged element should be inserted
function getDragAfterElement(column, y) {
  // Get all task cards in the column except the one being dragged, and filter to only direct children
  const allTaskCards = column.querySelectorAll(".task-card");
  const draggableElements = [...allTaskCards].filter(card => !card.classList.contains("dragging"));

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    // Find the first element below the drag position (offset > 0) with smallest offset
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

