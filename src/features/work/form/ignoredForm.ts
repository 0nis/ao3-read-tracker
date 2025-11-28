import { IgnoredWork } from "../../../types/works";
import { createWorkForm } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { CLASS_PREFIX } from "../../../constants/classes";
import { createExtensionMsg } from "../../../utils/extension/console";
import { handleStorageWrite } from "../../../utils/storage/handlers";

export async function showIgnoredWorkForm(
  exists: boolean,
  data: Partial<IgnoredWork>
): Promise<void> {
  if (!data.id) {
    console.warn(
      createExtensionMsg("Cannot show Ignored Work form without an ID.")
    );
    return;
  }
  const id = `${CLASS_PREFIX}__ignored-form`;
  const form = await createWorkForm<IgnoredWork>({
    id,
    title: "Ignore Work",
    exists,
    data,
    buildInnerHTML: (d, exists) => getIgnoredWorkFormMarkup(id, d, exists),
    onSubmit: async (form) => await markWorkAsIgnored(form, data),
    onDelete: async (form) =>
      await markWorkAsUnignored(data.id!, form, data.title),
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
const getIgnoredWorkFormMarkup = (
  prefix: string,
  d: Partial<IgnoredWork>,
  exists: boolean
) => `
    <fieldset>
        <legend>Ignore Work</legend>
        <p class="close actions"><a aria-label="cancel" id="${prefix}__close">×</a></p>
        <h4 class="heading byline">${
            exists ? "Edit ignored work info" : "Ignore this work"
        }</h4>

        <dl>
            <dt><label for="${prefix}__reason">Reason for ignoring</label></dt>
            <dd>
                <p class="${CLASS_PREFIX}__footnote footnote" id="${prefix}__reason__description">
                    A private reason that will appear in the work summary block for this work.
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

const markWorkAsUnignored = async (
  id: string,
  form: HTMLElement,
  title?: string
) => {
  await handleStorageWrite<void>(StorageService.ignoredWorks.delete(id), {
    successMsg: `${title || "This work"} will no longer be ignored.`,
    errorMsg: `Failed to unignore ${title || "this work"}.`,
    loadingEl:
      (form.querySelector('button[type="submit"]') as HTMLElement) || undefined,
    enforceMinDelay: true,
  });
};

const markWorkAsIgnored = async (
  form: HTMLFormElement,
  data: Partial<IgnoredWork>
) => {
  const payload: IgnoredWork = {
    id: data.id!,
    title: data.title!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    reason: (
      form.querySelector(
        `#${CLASS_PREFIX}__ignored-form__reason`
      ) as HTMLTextAreaElement
    ).value.trim(),
  };

  await handleStorageWrite<void>(StorageService.ignoredWorks.put(payload), {
    successMsg: `You have successfully ignored ${data.title || "this work"}.`,
    errorMsg: `Failed to ignore ${data.title || "this work"}.`,
    loadingEl:
      (form.querySelector('button[type="submit"]') as HTMLElement) || undefined,
    enforceMinDelay: true,
  });
};
