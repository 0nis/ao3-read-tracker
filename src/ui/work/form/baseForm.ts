export interface FicFormConfig<T> {
  /** Unique identifier for the form, not the fic ID! */
  id: string;
  title: string;
  exists: boolean;
  data: Partial<T>;
  buildInnerHTML: (prefix: string, data: Partial<T>, exists: boolean) => string;
  onSubmit: (form: HTMLFormElement) => Promise<void>;
  onDelete?: (form: HTMLFormElement) => Promise<void>;
  onClose?: () => void;
}

export async function createFicForm<T>(
  config: FicFormConfig<T>
): Promise<void> {
  const {
    id,
    title,
    exists,
    data,
    buildInnerHTML,
    onSubmit,
    onDelete,
    onClose,
  } = config;

  const prevScrollPos = window.scrollY || document.documentElement.scrollTop;
  const container = createFormContainer(id, title);
  const post = container.querySelector(".post")!;

  const form = document.createElement("form");
  form.className = `${id}__details`;

  form.innerHTML = buildInnerHTML(id, data, exists);

  form.addEventListener("remove", () => {
    container.remove();
    window.scrollTo(0, prevScrollPos);
    onClose?.();
  });

  post.appendChild(form);
  appendFormToFeedback(container);

  const deleteBtn = form.querySelector(
    `#${id}__delete`
  ) as HTMLButtonElement | null;
  if (exists && deleteBtn && onDelete) {
    deleteBtn.addEventListener("click", async () => {
      await onDelete(form);
      form.dispatchEvent(new Event("remove"));
    });
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    await onSubmit(form);
    form.dispatchEvent(new Event("remove"));
  });

  form.querySelector(`#${id}__close`)?.addEventListener("click", (e) => {
    e.preventDefault();
    form.dispatchEvent(new Event("remove"));
  });
}

export function createFormContainer(id: string, title: string): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper toggled";
  wrapper.id = id;
  wrapper.style.display = "block";

  const post = document.createElement("div");
  post.className = "post mark-as-read";
  post.innerHTML = `<h3 class="landmark heading">${title}</h3>`;
  wrapper.appendChild(post);

  return wrapper;
}

export function appendFormToFeedback(form: HTMLElement): void {
  const feedback = document.getElementById("feedback");
  if (!feedback) {
    console.error("[AO3 Mark as Read] Could not find #feedback container");
    return;
  }
  feedback.appendChild(form);
  form.scrollIntoView({ behavior: "instant", block: "start" });
}
