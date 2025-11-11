import { ReadFic } from "../../../types/storage";
import { createFicForm } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { showNotification } from "../../../utils/ui";

export async function showReadFicForm(
  exists: boolean,
  data: Partial<ReadFic>
): Promise<void> {
  await createFicForm<ReadFic>({
    id: "ext-mar__read-form",
    title: "Mark Fic as Read",
    exists,
    data,
    buildInnerHTML: (prefix, d, exists) =>
      getReadFicFormMarkup(prefix, d, exists),
    onSubmit: async (form) => await markFicAsRead(form, data),
    onDelete: async () => await markFicAsUnread(data.id!),
  });
}

// prettier-ignore
const getReadFicFormMarkup = (
  prefix: string,
  d: Partial<ReadFic>,
  exists: boolean
) => `
    <fieldset>
        <legend>Mark as Read</legend>
        <p class="close actions"><a aria-label="cancel" id="${prefix}__close">×</a></p>
        <h4 class="heading byline">${
            exists ? "Edit read fic info!" : "Mark this fic as read!"
        }</h4>

        <dl>
            <dt><label for="${prefix}__notes">Notes</label></dt>
            <dd>
            <p class="ext-mar__footnote footnote" id="${prefix}__notes__description">
                Private notes that will appear in the work summary block for this fic.
            </p>
            <textarea id="${prefix}__notes" rows="3">${
                exists ? d.notes || "" : ""
            }</textarea>
            </dd>

            <dt><label for="${prefix}__count">Times Read</label></dt>
            <dd><input type="number" id="${prefix}__count" min="1" value="${
                exists ? d.count || 1 : 1
            }" /></dd>

            <dt><label for="${prefix}__reread">Re-read Worthy</label></dt>
            <dd><input type="checkbox" id="${prefix}__reread" ${
                exists && d.reread ? "checked" : ""
            } /></dd>
        </dl>

        <p id="${prefix}__submit" class="submit actions">
            ${
              exists
                ? `<button type="button" id="${prefix}__delete">Mark as Unread</button>`
                : ""
            }
            <button type="submit">Save</button>
        </p>
    </fieldset>
`;

const markFicAsUnread = async (id: string) => {
  await StorageService.readFics.delete(id!);
  showNotification(`Fic ${id} marked as unread.`);
};

const markFicAsRead = async (form: HTMLFormElement, data: Partial<ReadFic>) => {
  const notes = (
    form.querySelector("#ext-mar__read-form__notes") as HTMLTextAreaElement
  ).value.trim();
  const count = parseInt(
    (form.querySelector("#ext-mar__read-form__count") as HTMLInputElement)
      .value,
    10
  );
  const reread = (
    form.querySelector("#ext-mar__read-form__reread") as HTMLInputElement
  ).checked;

  const fic: ReadFic = {
    id: data.id!,
    title: data.title!,
    timestamp: Date.now(),
    reread,
    count,
    notes,
  };
  const result = await StorageService.readFics.put(fic);
  showNotification(
    result.success
      ? `Fic ${data.id} marked as read.`
      : `Failed: ${result.error}`
  );
};
