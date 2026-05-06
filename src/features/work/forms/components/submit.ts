import { CLASS_PREFIX } from "../../../../constants/classes";
import { el } from "../../../../utils/dom";
import { WorkFormConfig } from "../types";

export function createFormSubmitElement(
  id: string,
  saveEl: HTMLButtonElement,
  deleteEl?: HTMLButtonElement,
): HTMLElement {
  return el(
    "p",
    {
      id: `${id}__submit`,
      className: `submit actions ${CLASS_PREFIX}__form__submit`,
    },
    [deleteEl, saveEl].filter(
      (el): el is HTMLButtonElement => el !== undefined,
    ),
  );
}

export function createFormSaveElement(
  id: string,
  cfg: WorkFormConfig<any>["submit"]["save"],
): HTMLButtonElement {
  return el(
    "button",
    {
      id: `${id}__save`,
      type: "submit",
      attrs: { "aria-label": cfg.ariaLabel },
    },
    [cfg.label],
  );
}

export function createFormDeleteElement(
  id: string,
  cfg: WorkFormConfig<any>["submit"]["delete"],
): HTMLButtonElement {
  return el(
    "button",
    {
      id: `${id}__delete`,
      type: "button",
      attrs: { "aria-label": cfg.ariaLabel },
    },
    [cfg.label],
  );
}
