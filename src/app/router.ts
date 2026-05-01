type Route = {
  path: string;
  render: () => void;
};

export const Router = {
  routes: [] as Route[],

  setup() {
    this.resolve();
  },

  navigate(path: string) {
    window.location.href = path;
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
