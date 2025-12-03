import { CLASS_PREFIX } from "../../constants/classes";
import { LoaderType } from "../../enums/ui";
import { el } from "./dom";

export interface LoaderController {
  start(): void;
  restore(): void;
  setProgress?(n: number): void;
}

export interface LoadingOperationOptions {
  enforceMinDelay?: boolean;
  minDelayMs?: number;
}

/**
 * Performs an async operation while managing a loading state on a given controller.
 *
 * @template T The return type of the async operation
 * @param controller Get this element with @function createButtonLoader
 * @param op The async operation to perform while showing the loading state
 * @param options Optional settings for the loading operation
 * @returns The result of the async operation
 */
export async function withLoadingState<T>(
  controller: LoaderController | null | undefined,
  op: (progress?: (value: number) => void) => Promise<T>,
  options: LoadingOperationOptions = {}
): Promise<T> {
  if (!controller) return await op();

  controller.start();

  const delay = options.enforceMinDelay
    ? new Promise((resolve) => setTimeout(resolve, options.minDelayMs ?? 300))
    : Promise.resolve();

  const internalProgressForwarder = controller.setProgress
    ? (raw: number) => controller.setProgress!(raw)
    : undefined;

  try {
    const [result] = await Promise.all([op(internalProgressForwarder), delay]);
    return result;
  } finally {
    controller.restore();
  }
}

/**
 * Creates a loader controller (object with start(), restore(), and setProgress() methods) for a button element.
 *
 * @param btn The button element to attach the loader to
 * @param type The type of loader to create (spinner or progress bar)
 * @returns A controller to manage the loader state to use in @function withLoadingState
 */
export function createButtonLoader(
  btn: HTMLButtonElement,
  type: LoaderType
): LoaderController {
  const originalDisabled = btn.disabled || false;
  const originalContent = Array.from(btn.childNodes);
  const originalWidth = btn.style.width;
  let loaderElement: HTMLElement;
  let setProgressFn: ((v: number) => void) | undefined;

  if (type === LoaderType.SPINNER) {
    loaderElement = createSpinnerLoader();
  } else {
    const { element, setProgress } = createProgressLoader();
    loaderElement = element;
    setProgressFn = setProgress;
  }

  return {
    start() {
      const style = getComputedStyle(btn);
      const contentWidth =
        btn.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      btn.style.width = `${contentWidth}px`;
      originalContent.forEach((n) => btn.removeChild(n));
      btn.setAttribute("aria-busy", "true");
      btn.appendChild(loaderElement);
      btn.disabled = true;
    },
    restore() {
      loaderElement.remove();
      originalContent.forEach((n) => btn.appendChild(n));
      btn.removeAttribute("aria-busy");
      btn.disabled = originalDisabled;
      btn.style.width = originalWidth;
    },
    setProgress: setProgressFn,
  };
}

function createSpinnerLoader(): HTMLElement {
  return el("span", {
    className: `${CLASS_PREFIX}__loader`,
    attrs: {
      role: "status",
      "aria-label": "Loading",
    },
  });
}

function createProgressLoader() {
  const container = el("span", {
    className: `${CLASS_PREFIX}__progress`,
    attrs: { role: "status", "aria-label": "Loading" },
  });

  const bar = el("span", {
    className: `${CLASS_PREFIX}__progress-bar`,
  });

  container.appendChild(bar);

  return {
    element: container,
    setProgress: (value: number) => {
      bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
    },
  };
}
