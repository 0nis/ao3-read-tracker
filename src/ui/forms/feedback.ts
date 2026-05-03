import { el, ensureChild } from "../../utils/dom";
import { reportSrLive } from "../../utils/srLive";
import { CLASS_PREFIX } from "../../constants/classes";
import { MessageType } from "../../enums/messages";

/**
 * Shows a message within a container element, replacing any existing message.
 *
 * @param container The container element where the message will be displayed
 * @param type The type of message (info, success, warning, error, loading)
 * @param message The text to display
 * @param className Optional custom class name for the message element
 */
export function showFormMessage(
  container: HTMLElement,
  type: MessageType,
  message: string,
  className: string = `${CLASS_PREFIX}__msg`,
): void {
  const oldMsg = container.querySelector(`.${className}`);
  if (oldMsg) oldMsg.remove();

  const msg = el("div", {
    className: `${className} ${className}--${type}`,
    textContent: message,
    attrs: { role: `${type === MessageType.ERROR ? "alert" : "status"}` },
  });

  container.appendChild(msg);
}

/**
 * Creates an AO3-style flash notice and either prepends it to #main or uses custom append logic
 *
 * @param msg The message to display
 * @param appendNotice Optional append logic to run instead of prepending to #main
 */
export function createFlashNotice(
  msg: string,
  options?: {
    appendNotice?: (notice: HTMLElement, main: HTMLElement) => void;
    positionId: string;
  },
): void {
  const main = document.getElementById("main");
  if (!main) return;

  const posId = options?.positionId || "top";

  const existing = main.querySelector(
    `#${CLASS_PREFIX}__flash-notice`,
  ) as HTMLElement | null;

  let counter = Number(existing?.dataset.count ?? 1);

  if (
    existing &&
    existing.childNodes[0]?.textContent?.trim() === msg &&
    existing.getAttribute("position") === posId
  ) {
    existing.dataset.count = String(++counter);
    const count = ensureChild({
      parent: existing,
      tag: "span",
      className: `${CLASS_PREFIX}__flash-notice__count`,
    });
    count.textContent = ` (x${counter})`;
    reportSrLive(msg);
    return;
  }

  // Remove both AO3 native notice and existing custom notice if any
  main.querySelector(".flash.notice")?.remove();
  existing?.remove();

  const notice = el(
    "div",
    {
      id: `${CLASS_PREFIX}__flash-notice`,
      className: "flash notice",
      attrs: {
        role: "status",
        position: posId,
      },
    },
    msg,
  );

  reportSrLive(msg);

  if (options?.appendNotice) return options?.appendNotice(main, notice);
  main.prepend(notice);
}
