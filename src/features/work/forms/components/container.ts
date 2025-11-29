import { el } from "../../../../utils/ui/dom";

export function createFormContainer(id: string, title: string): HTMLDivElement {
  const wrapper = el(
    "div",
    {
      className: "wrapper toggled",
      id,
      style: { display: "block" },
    },
    [
      el(
        "div",
        {
          className: "post",
          id: "mark",
          html: `<h3 class="landmark heading">${title}</h3>`,
        },
        [
          el(
            "form",
            { className: `${id}__details`, attrs: { "aria-label": title } },
            [el("fieldset", {}, [])]
          ),
        ]
      ),
    ]
  );

  return wrapper;
}

export const appendItemsToFormContainer = (
  form: HTMLElement,
  items: HTMLElement[]
) => {
  const fieldset = form.querySelector("fieldset");
  if (!fieldset) return;

  items.forEach((item) => fieldset.appendChild(item));
};
