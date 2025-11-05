export const Router = {
  routes: [] as Route[],

  setup() {
    const run = () => this.resolve();

    window.addEventListener("popstate", run);

    const push = history.pushState;
    history.pushState = function (...args) {
      const result = push.apply(this, args as any);
      window.dispatchEvent(new Event("urlchange"));
      return result;
    };

    window.addEventListener("urlchange", run);
    run();
  },

  register(path: string, render: () => void) {
    this.routes.push({ path, render });
  },

  resolve() {
    const match = this.routes.find((r) => r.path === location.pathname);
    if (match) match.render();
  },
};
