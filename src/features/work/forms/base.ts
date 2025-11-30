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
import { populateWorkForm } from "./handlers/populate";
import { saveWorkFormData } from "./handlers/save";
import { WorkFormConfig } from "./types";

import { Router } from "../../../app/router";
import { CLASS_PREFIX } from "../../../constants/classes";
import { createExtensionMsg } from "../../../utils/extension/console";

export function createWorkForm<T>(cfg: WorkFormConfig<T>): HTMLElement {
  const elId = `${CLASS_PREFIX}__${cfg.id}`;
  const prevScrollPos = window.scrollY || document.documentElement.scrollTop;

  const form = createFormContainer(elId, cfg.landmark);

  const remove = () => {
    form.remove();
    window.scrollTo(0, prevScrollPos);
    Router.back();
  };

  const saveEl = createFormSaveElement(elId, cfg.submit.save);
  saveEl.addEventListener("click", async (ev) => {
    ev.preventDefault();
    await saveWorkFormData(cfg, saveEl);
    remove();
  });

  let deleteEl: HTMLButtonElement | undefined;
  if (cfg.submit.delete.isDeletable) {
    deleteEl = createFormDeleteElement(elId, cfg.submit.delete);
    deleteEl.addEventListener("click", async (ev) => {
      ev.preventDefault();
      await deleteWorkFormData(cfg, deleteEl!);
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

  populateWorkForm(cfg);
  appendFormToFeedback(form, elId);
  return form;
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
