const Loader = {
  create() {
    console.log("creating loader");
  },
  destroy() {
    console.log("destroying loader");
  },
};

(async function main() {
  Loader.create();
  document.addEventListener("DOMContentLoaded", Loader.destroy);
})();
