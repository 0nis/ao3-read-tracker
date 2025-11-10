import { IgnoredFic } from "../../../types/storage";
import { createFormContainer, appendFormToFeedback } from "./baseForm";
import { StorageService } from "../../../services/storage";

export async function showIgnoredFicForm(
  exists: boolean,
  data: Partial<IgnoredFic>
): Promise<void> {
  const container = createFormContainer("ext-mar__ignored-form", "Ignore Fic");
  const post = container.querySelector(".post")!;

  const form = document.createElement("form");
  form.className = "ext-mar__details-form";

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

    const fic: IgnoredFic = {
      id: data.id!,
      title: data.title!,
      timestamp: Date.now(),
      reason,
    };
    await StorageService.ignoredFics.put(fic);

    container.remove();
  });

  form.querySelector(".ao3-form-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    container.remove();
  });
}
