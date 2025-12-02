const CLASS_PREFIX = "ext-rt__loader";
const ABBREVIATION = "EXT-RT";

const getLoaderStyles = () => {
  return `
    .${CLASS_PREFIX}__overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: opacity 0.5s ease;
      opacity: 1;
    }

    .${CLASS_PREFIX}--fadeout {
      opacity: 0;
      pointer-events: none;
    }

    .${CLASS_PREFIX}__spinner {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 4px solid #ccc;
      border-top-color: #900;
      animation: ${CLASS_PREFIX}-spin 0.8s linear infinite;
    }

    @keyframes ${CLASS_PREFIX}-spin {
      to { transform: rotate(360deg); }
    }

    /* Screen-reader-only element */
    .${CLASS_PREFIX}__sr {
      border: 0 !important;
      clip: rect(1px, 1px, 1px, 1px) !important;
      clip-path: inset(50%) !important;
      height: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
      padding: 0 !important;
      position: absolute !important;
      white-space: nowrap !important;
      width: 1px !important;
    }
  `;
};

const Loader = {
  parent: document.documentElement,
  el: null as HTMLDivElement | null,
  liveRegion: null as HTMLDivElement | null,
  styles: null as HTMLStyleElement | null,

  create() {
    if (this.el) return;

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = `${CLASS_PREFIX}__overlay`;
    overlay.setAttribute("aria-busy", "true");
    overlay.setAttribute("aria-live", "assertive");
    overlay.setAttribute("role", "alert");

    // Spinner
    const spinner = document.createElement("div");
    spinner.className = `${CLASS_PREFIX}__spinner`;

    overlay.appendChild(spinner);
    this.parent.appendChild(overlay);
    this.el = overlay;

    // Live region for screen readers
    const live = document.createElement("div");
    live.className = `${CLASS_PREFIX}__sr`;
    live.textContent = "The page is loading…";
    this.parent.appendChild(live);
    this.liveRegion = live;
  },

  injectStyles() {
    const styles = getLoaderStyles();

    if (document.getElementById(`${CLASS_PREFIX}--styles`)) return;

    const style = document.createElement("style");
    style.id = `${CLASS_PREFIX}--styles`;
    style.textContent = styles;

    this.parent.appendChild(style);
    this.styles = style;
  },

  destroy() {
    if (this.el) {
      this.el.classList.add(`${CLASS_PREFIX}--fadeout`);

      setTimeout(() => {
        this.el?.remove();
        this.el = null;

        this.liveRegion?.remove();
        this.liveRegion = null;

        this.styles?.remove();
        this.styles = null;
      }, 300);
    }
  },
};

(async function main() {
  Loader.injectStyles();
  Loader.create();

  document.addEventListener(
    `${ABBREVIATION}:loaded`,
    () => {
      Loader.destroy();
    },
    { once: true }
  );
})();
