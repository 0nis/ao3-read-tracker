import { Router } from "../../../app/router";
import { IgnoredFic, ReadFic } from "../../../types/storage";
import { el } from "../../../utils/dom";
import { createExtensionMsg } from "../../../utils/manifest";

export interface FicFormConfig<T> {
  /** Unique identifier for the form, not the fic ID! */
  id: string;
  title: string;
  exists: boolean;
  data: Partial<T>;
  buildInnerHTML: (data: Partial<T>, exists: boolean) => string;
  onSubmit: (form: HTMLFormElement) => Promise<void>;
  onDelete?: (form: HTMLFormElement) => Promise<void>;
  onClose?: () => void;
}

export async function createFicForm<T>(
  config: FicFormConfig<T>
): Promise<HTMLFormElement> {
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

  const form = el("form", {
    className: `${id}__details`,
    html: buildInnerHTML(data, exists),
    attrs: { "aria-label": title },
  });

  form.addEventListener("remove", () => {
    container.remove();
    window.scrollTo(0, prevScrollPos);
    Router.back();
    onClose?.();
  });

  post.appendChild(form);
  appendFormToFeedback(container, id);

  form.addEventListener("fic:close", () => {
    form.dispatchEvent(new Event("remove"));
  });

  form.addEventListener("fic:delete", async () => {
    if (onDelete) await onDelete(form);
    form.dispatchEvent(new Event("remove"));
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    await onSubmit(form);
    form.dispatchEvent(new Event("remove"));
  });

  return form;
}

export function createFormContainer(id: string, title: string): HTMLDivElement {
  const post = el("div", {
    className: "post mark-as-read",
    id: "mark",
    html: `<h3 class="landmark heading">${title}</h3>`,
  });

  const wrapper = el(
    "div",
    {
      className: "wrapper toggled",
      id,
      style: { display: "block" },
    },
    [post]
  );

  return wrapper;
}

export function appendFormToFeedback(form: HTMLElement, id: string): void {
  const feedback = document.getElementById("feedback");
  if (!feedback) {
    console.error(createExtensionMsg("Could not find #feedback container"));
    return;
  }
  feedback.appendChild(form);
  Router.addHash(id);
}
