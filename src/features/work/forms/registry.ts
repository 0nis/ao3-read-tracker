import { Router } from "../../../app/router";
import { CLASS_PREFIX } from "../../../constants/classes";

const registry = new Map<string, HTMLElement>();

export const FormRegistry = {
  get(id: string) {
    return registry.get(id) ?? null;
  },

  navigate(id: string) {
    Router.addHash(`${CLASS_PREFIX}__${id}`);
  },

  register(id: string, instance: HTMLElement) {
    registry.set(id, instance);
  },

  unregister(id: string) {
    registry.delete(id);
  },
};
