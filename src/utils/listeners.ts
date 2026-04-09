const listenersToRemove: Array<() => void> = [];

export function addGlobalListener(
  target: Window | Document,
  event: string,
  handler: EventListenerOrEventListenerObject
) {
  target.addEventListener(event, handler);
  listenersToRemove.push(() => target.removeEventListener(event, handler));
}

// Cleanup
window.addEventListener("unload", () => {
  for (const remove of listenersToRemove) remove();
  listenersToRemove.length = 0;
});
