import { addGlobalListener } from "../utils/extension";

type Route = {
  path: string;
  render: () => void;
};

export const Router = {
  routes: [] as Route[],

  setup() {
    addGlobalListener(window, "popstate", () => this.resolve());
    this.resolve();
  },

  navigate(path: string) {
    // TODO: Fix navigation issue
    window.history.pushState({}, "", path);
    this.resolve();
  },

  back() {
    window.history.back();
  },

  register(path: string, render: () => void) {
    this.routes.push({ path, render });
  },

  resolve() {
    const match = this.routes.find((r) => r.path === location.pathname);
    if (match) match.render();
  },

  addHash(hash: string) {
    location.replace(location.pathname + location.search + "#" + hash);
  },
};
