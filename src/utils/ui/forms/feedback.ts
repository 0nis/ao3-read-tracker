import { warn } from "../../extension";
import { el, ensureChild } from ".././dom";
import { reportSrLive } from ".././accessibility";
import { CLASS_PREFIX } from "../../../constants/classes";
import { MessageType } from "../../../enums/messages";
import { VerticalPlacement } from "../../../enums/settings";

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
  className: string = `${CLASS_PREFIX}__msg`
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

/** Adds an AO3-style flash notice to the top of the main content area */
export function createFlashNotice(
  msg: string,
  position: VerticalPlacement = VerticalPlacement.TOP
): void {
  const main = document.getElementById("main");
  if (!main) return;

  const existing = main.querySelector(
    `#${CLASS_PREFIX}__flash-notice`
  ) as HTMLElement | null;

  if (
    existing &&
    existing.childNodes[0]?.textContent?.trim() === msg &&
    existing.getAttribute("position") === position
  ) {
    const count = ensureChild({
      parent: existing,
      tag: "span",
      className: `${CLASS_PREFIX}__flash-notice__count`,
    });
    const currentCount = parseInt(
      count.textContent?.replace(/\D/g, "") || "1",
      10
    );
    count.textContent = ` (x${currentCount + 1})`;
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
        position: position,
      },
    },
    msg
  );

  reportSrLive(msg);

  if (position === VerticalPlacement.BOTTOM) {
    const el = main.querySelector("#feedback")?.querySelector("ul.actions");
    if (el) el.after(notice);
    else {
      warn(
        "Could not find #feedback.ul.actions to insert flash notice after. Prepending to main instead."
      );
      main.prepend(notice);
    }
    return;
  }
  main.prepend(notice);
}
