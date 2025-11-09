import { ReadFic } from "../../../types/storage";
import { createFormContainer, appendFormToFeedback } from "./baseForm";
import { StorageService } from "../../../services/storage";

export async function showReadFicForm(
  id: string,
  title: string
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

      <h4 class="heading byline">Mark this fic as read!</h4>

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
          ></textarea>
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
            value="1"
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
          />
        </dd>
        
      </dl>

      <p id="ext-mar__read-form__submit" class="submit actions">
        <button type="submit">Save</button>
      </p>
    </fieldset>
  `;

  post.appendChild(form);
  appendFormToFeedback(container);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const reread = (
      form.querySelector("#ext-mar__read-form__reread") as HTMLInputElement
    ).checked;
    const count =
      parseInt(
        (form.querySelector("#ext-mar__read-form__count") as HTMLInputElement)
          .value,
        10
      ) || 1;
    const notes = (
      form.querySelector("#ext-mar__read-form__notes") as HTMLTextAreaElement
    ).value.trim();

    const fic: ReadFic = {
      id,
      title,
      timestamp: Date.now(),
      reread,
      count,
      notes,
    };
    await StorageService.addReadFic(fic);

    container.remove();
  });

  form
    .querySelector("#ext-mar__read-form__close")
    ?.addEventListener("click", (e) => {
      container.remove();
    });
}
