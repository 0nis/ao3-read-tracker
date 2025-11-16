// TODO: Replace alert with a better notification system
export function showNotification(message: string): void {
  alert(message);
}

/**
 * Gets an existing element by class name within a parent element, or creates it if it doesn't exist.
 * @param parent The parent element to search within or append to
 * @param className The class name of the element to get or create
 * @param tagName The tag name of the element to get or create (e.g., 'div', 'span')
 * @returns The existing or newly created HTMLElement
 */
export function getOrCreateElement(
  parent: HTMLElement,
  className: string,
  tagName: string
): HTMLElement {
  let element = parent.querySelector(`.${className}`) as HTMLElement | null;
  if (!element) {
    element = document.createElement(tagName);
    element.className = className;
    parent.appendChild(element);
  }
  return element;
}

/**
 * Gets an element by selector within a parent element.
 * @param parent The parent element to search within
 * @param selector The selector of the element to get
 * @returns The found HTMLElement or null if not found
 */
export const getElement = (
  parent: HTMLElement,
  selector: string
): HTMLElement | null => parent.querySelector(selector);
