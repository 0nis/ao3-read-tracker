import {
  appendItemsToFormContainer,
  createFormContainer,
} from "./components/container";
import {
  createFormCancelElement,
  createFormHeaderElements,
} from "./components/header";
import { createFormContent } from "./components/items";
import {
  createFormDeleteElement,
  createFormSaveElement,
  createFormSubmitElement,
} from "./components/submit";
import { deleteWorkFormData } from "./handlers/delete";
import { saveWorkFormData } from "./handlers/save";
import { WorkFormConfig } from "./types";
import { FormRegistry } from "./registry";
import { WorkActionEvent, WorkActionState, WorkActionTypeMap } from "../config";

import { Router } from "../../../app/router";
import { CLASS_PREFIX } from "../../../constants/classes";
import { error } from "../../../utils/extension";
import { ABBREVIATION } from "../../../constants/global";
import { populateFormValues } from "../../../utils/ui/forms";

export function createWorkForm<K extends keyof WorkActionTypeMap>(
  cfg: WorkFormConfig<WorkActionTypeMap[K]> & { id: K }
): HTMLElement {
  const elId = `${CLASS_PREFIX}__${cfg.id}-form`;
  const prevScrollPos = window.scrollY || document.documentElement.scrollTop;

  const form = createFormContainer(elId, cfg.landmark);

  const remove = () => {
    window.scrollTo(0, prevScrollPos);
    FormRegistry.unregister(cfg.id);
    form.remove();
  };

  const updateState = (state: WorkActionState, event: WorkActionEvent) => {
    document.dispatchEvent(
      new CustomEvent(`${ABBREVIATION}:updated`, {
        detail: {
          workAction: cfg.id,
          state,
          workActionEvent: event,
        },
      })
    );
  };

  const saveEl = createFormSaveElement(elId, cfg.submit.save);
  saveEl.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await saveWorkFormData(cfg, saveEl, cfg.origin);
    updateState(WorkActionState.MARKED, WorkActionEvent.SAVE);
    remove();
  });

  let deleteEl: HTMLButtonElement | undefined;
  if (cfg.submit.delete.isDeletable) {
    deleteEl = createFormDeleteElement(elId, cfg.submit.delete);
    deleteEl.addEventListener("click", async (ev) => {
      ev.preventDefault();
      await deleteWorkFormData(cfg, deleteEl!, cfg.origin);
      updateState(WorkActionState.UNMARKED, WorkActionEvent.DELETE);
      remove();
    });
  }

  const cancelBtn = createFormCancelElement(elId);
  cancelBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    remove();
  });

  appendItemsToFormContainer(form, [
    ...createFormHeaderElements(cfg.landmark, cfg.heading, cancelBtn),
    createFormContent(cfg.items),
    createFormSubmitElement(elId, saveEl, deleteEl),
  ]);

  // populateWorkForm(cfg);
  populateFormValues(cfg.items, cfg.data);
  FormRegistry.register(cfg.id, {
    hash: elId,
  });
  appendFormToFeedback(form, elId);
  return form;
}

export function appendFormToFeedback(form: HTMLElement, id: string): void {
  const feedback = document.getElementById("feedback");
  if (!feedback) {
    error("Could not find #feedback container");
    return;
  }
  feedback.appendChild(form);
  Router.addHash(id);
}
