import { IgnoredFic } from "../../../types/storage";
import { createFicForm } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { showNotification } from "../../../utils/dialogs";
import { CLASS_PREFIX } from "../../../constants/classes";
import { createExtensionMsg } from "../../../utils/manifest";
import { handleStorageResult } from "../../../utils/form";

export async function showIgnoredFicForm(
  exists: boolean,
  data: Partial<IgnoredFic>
): Promise<void> {
  if (!data.id) {
    console.warn(
      createExtensionMsg("Cannot show Ignored Fic form without an ID.")
    );
    return;
  }
  const id = `${CLASS_PREFIX}__ignored-form`;
  const form = await createFicForm<IgnoredFic>({
    id,
    title: "Ignore Fic",
    exists,
    data,
    buildInnerHTML: (d, exists) => getIgnoredFicFormMarkup(id, d, exists),
    onSubmit: async (form) => await markFicAsIgnored(form, data),
    onDelete: async () => await markFicAsUnignored(data.id!, data.title),
  });

  form.querySelector(`#${id}__close`)?.addEventListener("click", (e) => {
    e.preventDefault();
    form.dispatchEvent(new CustomEvent("fic:close"));
  });

  form.querySelector(`#${id}__delete`)?.addEventListener("click", (e) => {
    e.preventDefault();
    form.dispatchEvent(new CustomEvent("fic:delete"));
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
                <p class="${CLASS_PREFIX}__footnote footnote" id="${prefix}__reason__description">
                    A private reason that will appear in the work summary block for this fic.
                </p>
                <textarea 
                  id="${prefix}__reason" 
                  rows="3"
                  aria-describedby="${prefix}__reason__description"
                >${
                    exists ? d.reason || "" : ""
                }</textarea>
            </dd>
        </dl>

        <p id="${prefix}__submit" class="submit actions">
            ${
            exists
                ? `<button 
                    type="button" 
                    id="${prefix}__delete"
                    aria-label="Remove ${d.title || "this work"} from ignored list"
                  >Unignore</button>`
                : ""
            }
            <button 
              id="${prefix}__save"
              type="submit"
              aria-label="Save and ignore ${d.title || "this work"}"
            >Save</button>
        </p>
    </fieldset>
`;

const markFicAsUnignored = async (id: string, title?: string) => {
  const result = await StorageService.ignoredFics.delete(id!);
  handleStorageResult(
    result,
    `${title || "This work"} will no longer be ignored.`,
    `Failed to unignore ${title || "this work"}.`
  );
};

const markFicAsIgnored = async (
  form: HTMLFormElement,
  data: Partial<IgnoredFic>
) => {
  const reason = (
    form.querySelector(
      `#${CLASS_PREFIX}__ignored-form__reason`
    ) as HTMLTextAreaElement
  ).value.trim();
  const fic: IgnoredFic = {
    id: data.id!,
    title: data.title!,
    timestamp: Date.now(),
    reason,
  };
  const result = await StorageService.ignoredFics.put(fic);
  handleStorageResult(
    result,
    `You have successfully ignored ${data.title || "this work"}.`,
    `Failed to ignore ${data.title || "this work"}.`
  );
};
