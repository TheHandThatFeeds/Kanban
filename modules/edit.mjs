import { updateStorage } from "./storage.mjs";

export function attachEditControls(
  taskCard,
  titleEl,
  descEl,
  controlsContainer = taskCard,
) {
  const editBtn = document.createElement("button");
  editBtn.className = "edit-task-btn";
  editBtn.innerHTML = '<ion-icon name="pencil-outline"></ion-icon>';

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Redigera inte om kortet ligger i trash
    if (taskCard.classList.contains("in-trash")) return;

    // Om redan i edit-läge: gör inget
    if (taskCard.querySelector(".edit-form")) return;

    const oldTitle = titleEl.textContent;
    const oldDesc = descEl.textContent;

    const form = document.createElement("div");
    form.className = "edit-form";
    form.innerHTML = `
<input class="edit-title" type="text" placeholder="Rubrik" />
<textarea class="edit-desc" rows="3" placeholder="Beskrivning"></textarea>
<div class="edit-actions">
        <button class="edit-cancel-btn" type="button">Avbryt</button>
        <button class="edit-save-btn" type="button">Spara</button>
</div>
    `;

    const input = form.querySelector(".edit-title");
    const textarea = form.querySelector(".edit-desc");
    input.value = oldTitle;
    textarea.value = oldDesc;

    // Dölj text under tiden
    titleEl.style.display = "none";
    descEl.style.display = "none";

    taskCard.appendChild(form);
    input.focus();

    // Avbryt
    form.querySelector(".edit-cancel-btn").addEventListener("click", () => {
      form.remove();
      titleEl.style.display = "";
      descEl.style.display = "";
    });

    // Spara
    form.querySelector(".edit-save-btn").addEventListener("click", () => {
      const newTitle = input.value.trim();
      const newDesc = textarea.value.trim();

      if (!newTitle) {
        input.focus();
        return;
      }

      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;

      form.remove();
      titleEl.style.display = "";
      descEl.style.display = "";

      updateStorage(); // uppdatera LS vid edit->save
    });
  });

  targetContainer.appendChild(editBtn);
}
