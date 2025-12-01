import { Router } from "../../../app/router";
import { CLASS_PREFIX } from "../../../constants/classes";

export type FormRegistryValue = {
  hash: string;
};

const registry = new Map<string, FormRegistryValue>();

export const FormRegistry = {
  get(id: string) {
    return registry.get(id) ?? null;
  },

  navigate(id: string) {
    const entry = registry.get(id);
    if (!entry) return;
    Router.addHash(entry.hash);
  },

  register(id: string, value: FormRegistryValue) {
    registry.set(id, value);
  },

  unregister(id: string) {
    registry.delete(id);
  },
};
