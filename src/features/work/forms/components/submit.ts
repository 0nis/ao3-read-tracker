import { CLASS_PREFIX } from "../../../../constants/classes";
import { el } from "../../../../utils/ui/dom";
import { WorkFormConfig } from "../types";

export function createFormSubmitElement(
  id: string,
  saveEl: HTMLButtonElement,
  deleteEl: HTMLButtonElement
): HTMLElement {
  return el(
    "p",
    {
      id: `${id}__submit`,
      className: `submit actions`,
    },
    [saveEl, deleteEl]
  );
}

export function createFormSaveElement(
  id: string,
  cfg: WorkFormConfig<any>["submit"]["save"]
): HTMLButtonElement {
  return el(
    "button",
    {
      id: `${id}__save`,
      className: `button ${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--save`,
      attrs: { "aria-label": cfg.ariaLabel },
    },
    [cfg.label]
  );
}

export function createFormDeleteElement(
  id: string,
  cfg: WorkFormConfig<any>["submit"]["delete"]
): HTMLButtonElement {
  return el(
    "button",
    {
      id: `${id}__delete`,
      className: `button ${CLASS_PREFIX}__button ${CLASS_PREFIX}__button--delete`,
      attrs: {
        "aria-label": cfg.ariaLabel,
        disabled: String(!cfg.isDeletable),
      },
    },
    [cfg.label]
  );
}
