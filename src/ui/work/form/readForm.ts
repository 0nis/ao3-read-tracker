import { ReadFic } from "../../../types/storage";
import { createFormContainer, appendFormToFeedback } from "./baseForm";
import { StorageService } from "../../../services/storage";

export async function showReadFicForm(
  id: string,
  title: string
): Promise<void> {
  const container = createFormContainer("Mark as Read Details");
  const post = container.querySelector(".post")!;

  const form = document.createElement("form");
  form.className = "ao3-mark-as-read__details-form";

  form.innerHTML = `
    <fieldset>
      <legend>Read Fic Details</legend>
      <p class="close actions"><a href="#">×</a></p>

      <dl>
        <dt><label for="keeper">Re-read Worthy?</label></dt>
        <dd><input type="checkbox" id="keeper" /></dd>

        <dt><label for="count">Read Count</label></dt>
        <dd><input type="number" id="count" min="1" value="1" /></dd>

        <dt><label for="notes">Notes</label></dt>
        <dd><textarea id="notes" rows="3" placeholder="Write notes..."></textarea></dd>
      </dl>

      <p class="submit actions">
        <button type="submit">Save</button>
      </p>
    </fieldset>
  `;

  post.appendChild(form);
  appendFormToFeedback(container);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const keeper = (form.querySelector("#keeper") as HTMLInputElement).checked;
    const count =
      parseInt((form.querySelector("#count") as HTMLInputElement).value, 10) ||
      1;
    const notes = (
      form.querySelector("#notes") as HTMLTextAreaElement
    ).value.trim();

    const fic: ReadFic = {
      id,
      title,
      timestamp: Date.now(),
      keeper,
      count,
      notes,
    };
    await StorageService.addReadFic(fic);

    container.remove();
  });

  form.querySelector(".ao3-form-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    container.remove();
  });
}
