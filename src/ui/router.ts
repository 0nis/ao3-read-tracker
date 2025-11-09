export const Router = {
  routes: [] as Route[],

  setup() {
    this.resolve();
  },

  navigate(path: string) {
    window.location.href = path;
  },

  register(path: string, render: () => void) {
    this.routes.push({ path, render });
  },

  resolve() {
    const match = this.routes.find((r) => r.path === location.pathname);
    if (match) match.render();
  },
};
