import { ReadFic } from "../../../types/storage";
import { createFicForm } from "./baseForm";
import { StorageService } from "../../../services/storage";
import { showNotification } from "../../../utils/dom";
import { CLASS_PREFIX } from "../../../constants/classes";
import { getCurrentChapterFromWorkPage } from "../../../utils/ao3";

export async function showReadFicForm(
  exists: boolean,
  data: Partial<ReadFic>
): Promise<void> {
  const id = `${CLASS_PREFIX}__read-form`;
  const form = await createFicForm<ReadFic>({
    id,
    title: "Mark Fic as Read",
    exists,
    data,
    buildInnerHTML: (d, exists) => getReadFicFormMarkup(id, d, exists),
    onSubmit: async (form) => await markFicAsRead(form, data),
    onDelete: async () => await markFicAsUnread(data.id!),
  });

  const isReadingCheckbox = form.querySelector(
    `#${id}__isreading`
  ) as HTMLInputElement;
  const lastReadChapterInput = form.querySelector(
    `#${id}__lastReadChapter`
  ) as HTMLInputElement;

  if (isReadingCheckbox && lastReadChapterInput) {
    isReadingCheckbox.addEventListener("change", () => {
      const chapter = getCurrentChapterFromWorkPage();
      lastReadChapterInput.disabled = !isReadingCheckbox.checked;
      if (isReadingCheckbox.checked && chapter !== null)
        lastReadChapterInput.value = chapter.toString();
      else lastReadChapterInput.value = "";
    });
  }

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
              <p class="${CLASS_PREFIX}__footnote footnote" id="${prefix}__notes__description">
                  Private notes that will appear in the work summary block for this fic.
              </p>
              <textarea 
                id="${prefix}__notes" 
                rows="3" 
                aria-describedby="${prefix}__notes__description">${exists && d.notes || ""}</textarea>
            </dd>

            <dt><label for="${prefix}__count">Times read</label></dt>
            <dd>
              <p class="${CLASS_PREFIX}__footnote footnote" id="${prefix}__count__description">
                  The number of times you've read this fic.
              </p>
              <input 
                type="number" 
                id="${prefix}__count" 
                min="1" 
                aria-describedby="${prefix}__count__description" 
                value="${exists && d.count || 1}" 
              />
            </dd>

            <div class="${CLASS_PREFIX}__align-horizontally">

              <div>
                <dt><label for="${prefix}__reread">Re-read worthy?</label></dt>
                <dd><input type="checkbox" id="${prefix}__reread" ${
                    exists && d.rereadWorthy ? "checked" : ""
                } /></dd>
              </div>

              <div>
                <dt><label for="${prefix}__isreading">Still reading?</label></dt>
                <dd>
                <input type="checkbox" id="${prefix}__isreading" ${
                    exists && d.isReading ? "checked" : ""
                } /></dd>
              </div>

              <div>
                <dt><label for="${prefix}__lastReadChapter">Last read chapter</label></dt>
                <dd><input type="number" id="${prefix}__lastReadChapter" min="0" value="${
                    exists && d.lastReadChapter ? d.lastReadChapter : null
                }" disabled="${
                    exists && d.isReading ? "disabled" : ""
                }"/></dd>
              </div>

            </div>
            
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
  const getInputValue = <T>(
    selector: string,
    parser: (val: HTMLInputElement | HTMLTextAreaElement) => T,
    defaultValue: T
  ): T => {
    const input = form.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement;
    if (!input) return defaultValue;
    return parser(input);
  };

  const fic: ReadFic = {
    id: data.id!,
    title: data.title!,
    createdAt: data.createdAt || Date.now(),
    modifiedAt: Date.now(),
    rereadWorthy: getInputValue<boolean>(
      `#${CLASS_PREFIX}__read-form__reread`,
      (val) => (val as HTMLInputElement).checked,
      false
    ),
    count: getInputValue<number>(
      `#${CLASS_PREFIX}__read-form__count`,
      (val) => parseInt(val.value, 10),
      1
    ),
    notes: getInputValue<string>(
      `#${CLASS_PREFIX}__read-form__notes`,
      (val) => val.value.trim(),
      ""
    ),
    isReading: getInputValue<boolean>(
      `#${CLASS_PREFIX}__read-form__isreading`,
      (val) => (val as HTMLInputElement).checked,
      false
    ),
    lastReadChapter: getInputValue<number | undefined>(
      `#${CLASS_PREFIX}__read-form__lastReadChapter`,
      (val) => parseInt(val.value, 10),
      undefined
    ),
  };
  const result = await StorageService.readFics.put(fic);
  showNotification(
    result.success
      ? `Fic ${data.id} marked as read.`
      : `Failed: ${result.error}`
  );
};
