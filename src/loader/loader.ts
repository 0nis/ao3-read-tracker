import { getStyles } from "./styles";
import { el } from "../utils/ui/dom";
import { CLASS_PREFIX } from "../constants/classes";

const PREFIX = `${CLASS_PREFIX}__loader`;

/**
 * Page-wide loader attaching to `document.documentElement`.
 *
 * @example
 *   Loader.create();
 *   Loader.destroy();
 */
class LoaderImpl {
  private parent: HTMLElement;
  private loaderEl: HTMLDivElement | null = null;
  private liveRegion: HTMLDivElement | null = null;
  private styles: HTMLStyleElement | null = null;

  constructor() {
    this.parent = document.documentElement;
  }

  public create() {
    if (this.loaderEl) return;

    this.injectStyles();

    const overlay = el(
      "div",
      {
        className: `${PREFIX}__overlay`,
        attrs: {
          "aria-busy": "true",
          "aria-live": "assertive",
          role: "alert",
        },
      },
      [el("div", { className: `${PREFIX}__spinner` })],
    );

    this.parent.appendChild(overlay);
    this.loaderEl = overlay;

    this.initSrLive();
  }

  public destroy() {
    if (this.loaderEl) {
      this.loaderEl.classList.add(`${PREFIX}--fadeout`);

      setTimeout(() => {
        this.loaderEl?.remove();
        this.loaderEl = null;

        this.liveRegion?.remove();
        this.liveRegion = null;

        this.styles?.remove();
        this.styles = null;
      }, 300);
    }
  }

  private initSrLive() {
    if (this.liveRegion) return;

    const live = el(
      "div",
      { className: `${PREFIX}__sr`, attrs: { "aria-live": "polite" } },
      ["The page is loading…"],
    );
    this.parent.appendChild(live);
    this.liveRegion = live;
  }

  private injectStyles() {
    if (document.getElementById(`${PREFIX}--styles`)) return;

    const style = el("style", {
      id: `${PREFIX}--styles`,
      textContent: getStyles(PREFIX),
      attrs: { type: "text/css" },
    });

    this.parent.appendChild(style);
    this.styles = style;
  }
}

export const Loader = new LoaderImpl();
