// localstorage
const STORAGE_KEY = "kanban_tasks";

export function updateStorage() {
  const columnIds = [
    "inputDiv-column1",
    "inputDiv-column2",
    "inputDiv-column3",
    "inputDiv-column4",
    "trashList",
  ];
  const tasks = [];

  columnIds.forEach((id) => {
    const column = document.getElementById(id);
    const cards = column.querySelectorAll(".task-card");

    cards.forEach((card) => {
      tasks.push({
        title: card.querySelector(".task-title").textContent,
        description: card.querySelector(".task-description").textContent,
        timestamp: card.querySelector(".task-timestamp").textContent,
        columnId: id, // This tracks where the card is
        inTrash: card.classList.contains("in-trash"),
      });
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
