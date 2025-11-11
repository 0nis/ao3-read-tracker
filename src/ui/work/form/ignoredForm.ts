import { IgnoredFic } from "../../../types/storage";
import { createFicForm } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { showNotification } from "../../../utils/ui";

export async function showIgnoredFicForm(
  exists: boolean,
  data: Partial<IgnoredFic>
): Promise<void> {
  await createFicForm<IgnoredFic>({
    id: "ext-mar__ignored-form",
    title: "Ignore Fic",
    exists,
    data,
    buildInnerHTML: (prefix, d, exists) =>
      getIgnoredFicFormMarkup(prefix, d, exists),
    onSubmit: async (form) => await markFicAsIgnored(form, data),
    onDelete: async () => await markFicAsUnignored(data.id!),
  });
}

// prettier-ignore
const getIgnoredFicFormMarkup = (
  prefix: string,
  d: Partial<IgnoredFic>,
  exists: boolean
) => `
    <fieldset>
        <legend>Ignore Fic</legend>
        <p class="close actions"><a aria-label="cancel" id="${prefix}__close">×</a></p>
        <h4 class="heading byline">${
            exists ? "Edit ignored fic info" : "Ignore this fic"
        }</h4>

        <dl>
            <dt><label for="${prefix}__reason">Reason for ignoring</label></dt>
            <dd>
                <p class="ext-mar__footnote footnote" id="ext-mar__ignored-form__reason__description">
                    A private reason that will appear in the work summary block for this fic.
                </p>
                <textarea id="${prefix}__reason" rows="3">${
                    exists ? d.reason || "" : ""
                }</textarea>
            </dd>
        </dl>

        <p id="${prefix}__submit" class="submit actions">
            ${
            exists
                ? `<button type="button" id="${prefix}__delete">Unignore</button>`
                : ""
            }
            <button type="submit">Save</button>
        </p>
    </fieldset>
`;

const markFicAsUnignored = async (id: string) => {
  await StorageService.ignoredFics.delete(id!);
  showNotification(`Fic ${id} is no longer being ignored.`);
};

const markFicAsIgnored = async (
  form: HTMLFormElement,
  data: Partial<IgnoredFic>
) => {
  const reason = (
    form.querySelector("#ext-mar__ignored-form__reason") as HTMLTextAreaElement
  ).value.trim();
  const fic: IgnoredFic = {
    id: data.id!,
    title: data.title!,
    timestamp: Date.now(),
    reason,
  };
  const result = await StorageService.ignoredFics.put(fic);
  showNotification(
    result.success
      ? `Fic ${data.id} is now being ignored.`
      : `Failed: ${result.error}`
  );
};
