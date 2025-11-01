// TODO: Replace alert with a better notification system
export function showNotification(message: string): void {
  alert(message);
}

export function addButtonToNav(
  nav: HTMLElement,
  onClick: (ev: MouseEvent, isOn?: boolean) => void,
  label?: string | null,
  toggleLabels?: { ON: string; OFF: string } | null,
  useToggle = true
): HTMLLIElement {
  if (useToggle && !toggleLabels)
    throw new Error("Toggle labels must be provided for toggle buttons.");

  const li = document.createElement("li");
  const button = document.createElement("a");
  button.href = "#";
  button.textContent = toggleLabels?.OFF || label || null;

  button.addEventListener("click", (ev) => {
    if (!useToggle) {
      onClick(ev);
      return;
    }
    const isOn = button.textContent === toggleLabels?.ON;
    if (isOn) {
      button.textContent = toggleLabels?.OFF || null;
      onClick(ev, true);
    } else {
      button.textContent = toggleLabels?.ON || null;
      onClick(ev, false);
    }
  });
  li.appendChild(button);
  nav.appendChild(li);
  return li;
}
