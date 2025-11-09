import { IgnoredFic } from "../../../types/storage";
import { createFormContainer, appendFormToFeedback } from "./baseForm";
import { StorageService } from "../../../services/storage";

export async function showIgnoredFicForm(
  id: string,
  title: string
): Promise<void> {
  const container = createFormContainer("Ignore Fic");
  const post = container.querySelector(".post")!;

  const form = document.createElement("form");
  form.className = "ao3-mark-as-read__details-form";

  form.innerHTML = `
    <fieldset>
      <legend>Ignore Fic Details</legend>
      <p class="close actions"><a href="#" class="ao3-form-close">x</a></p>

      <dl>
        <dt><label for="reason">Reason for ignoring</label></dt>
        <dd><textarea id="reason" rows="3" placeholder="Optional reason..."></textarea></dd>
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
    const reason = (
      form.querySelector("#reason") as HTMLTextAreaElement
    ).value.trim();

    const fic: IgnoredFic = { id, title, timestamp: Date.now(), reason };
    await StorageService.addIgnoredFic(fic);

    container.remove();
  });

  form.querySelector(".ao3-form-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    container.remove();
  });
}
