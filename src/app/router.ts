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
    // TODO: Fix navigation issue
    // okay I figured out why it's happening again and how to fix
    // basically, future me, this is happening because instead of actually *navigating*, I'm *only* adding a new path to the url.
    // that indeed does add it to the history and allows me to navigate "back" to the previous page, but...
    // the previous page was fully overwritten by my "resolve". It does not exist anymore.
    // to fix, do something like you did with the error page in bootstrap: navigate to "/", then replace that content.
    // of course, also ensure you (visually!) update the URL just like in bootstrap.

    // window.location.replace(FALLBACK_PATH); // <-- remember, your code stops running after this! Use SessionStorage to identify the original path
    // history.replaceState({}, "", ORIGINAL_PATH); // <-- used to visually restore the original path
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
    console.log("resolve", location.pathname);
    const match = this.routes.find((r) => r.path === location.pathname);
    if (match) match.render();
  },

  addHash(hash: string) {
    location.replace(location.pathname + location.search + "#" + hash);
  },
};
