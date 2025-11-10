import { ReadFic } from "../../../types/storage";
import { createFormContainer, appendFormToFeedback } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { showNotification } from "../../../utils/ui";
// TODO: Add mark as unread button when already marked as read
export async function showReadFicForm(
  exists: boolean,
  data: Partial<ReadFic>
): Promise<void> {
  const container = createFormContainer(
    "ext-mar__read-form",
    "Mark as Read Details"
  );
  const post = container.querySelector(".post")!;

  const form = document.createElement("form");
  form.className = "ext-mar__read-form__details";

  form.innerHTML = `
    <fieldset>
      <legend>Mark as Read</legend>
      <p class="close actions">
        <a href="#comments" aria-label="cancel" id="ext-mar__read-form__close">×</a>
      </p>

      <h4 class="heading byline">${
        exists ? "Edit Read Fic Info" : "Mark this fic as read!"
      }</h4>

      <dl>
        <dt><label for="ext-mar__read-form__notes">Notes</label></dt>
        <dd>
          <p class="ext-mar__footnote footnote" id="ext-mar__read-form__notes__description">
            Private notes that will appear in the work summary block for this fic.
          </p>
          <textarea 
            id="ext-mar__read-form__notes" 
            class="observe_textlength" 
            rows="3" 
            aria-describedby="ext-mar__read-form__notes__description"
            >${exists ? data.notes || "" : ""}</textarea>
        </dd>

        <dt><label for="ext-mar__read-form__count">Times Read</label></dt>
        <dd>
          <p class="ext-mar__footnote footnote" id="ext-mar__read-form__count__description">
            Track how many times you've read this fic.
          </p>
          <input 
            type="number" 
            id="ext-mar__read-form__count" 
            min="1" 
            value="${exists ? data.count || 1 : 1}"
            aria-describedby="ext-mar__read-form__count__description"
           />
        </dd>
        
        <dt><label for="ext-mar__read-form__reread">Re-read Worthy</label></dt>
        <dd>
          <p class="ext-mar__footnote footnote" id="ext-mar__read-form__reread__description">
            Check this if you'd want to come back and read this work again.
          </p>
          <input 
            type="checkbox" 
            id="ext-mar__read-form__reread" 
            aria-describedby="ext-mar__read-form__reread__description" 
            ${exists && data.reread ? "checked" : ""}
          />
        </dd>
        
      </dl>

      <p id="ext-mar__read-form__submit" class="submit actions">
        <button type="submit">Save</button>
      </p>
    </fieldset>
  `;

  const reread = form.querySelector(
    "#ext-mar__read-form__reread"
  ) as HTMLInputElement;
  const count = form.querySelector(
    "#ext-mar__read-form__count"
  ) as HTMLInputElement;
  const notes = form.querySelector(
    "#ext-mar__read-form__notes"
  ) as HTMLTextAreaElement;

  post.appendChild(form);
  appendFormToFeedback(container);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const fic: ReadFic = {
      id: data.id!,
      title: data.title!,
      timestamp: Date.now(),
      reread: reread.checked,
      count: parseInt(count.value, 10),
      notes: notes.value.trim(),
    };
    const result = await StorageService.readFics.put(fic);
    if (result.success) showNotification(`Fic ${data.id} marked as read.`);
    else
      showNotification(
        `Failed to mark fic ${data.id} as read: ${result.error}`
      );
    container.remove();
  });

  form
    .querySelector("#ext-mar__read-form__close")
    ?.addEventListener("click", (e) => {
      container.remove();
    });
}
