export function createOverlay(): HTMLDivElement {
  const overlay = document.createElement("div");
  overlay.id = "readTrackerOverlay";
  overlay.className = "read-tracker__overlay";
  overlay.classList.add("hidden");
  return overlay;
}

export function createModal(): HTMLDivElement {
  const modal = document.createElement("div");
  modal.id = "readTrackerModal";
  modal.className = "read-tracker__modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "readTrackerHeading");
  modal.classList.add("hidden");

  modal.innerHTML = `
    <div class="read-tracker__header">
      <h3 id="readTrackerHeading" class="read-tracker__title">AO3 Read Tracker Settings</h3>
      <div class="read-tracker__settings">
        <button id="importWordsBtn" class="read-tracker__btn">Import</button>
        <button id="exportWordsBtn" class="read-tracker__btn">Export</button>
      </div>
    </div>

    <input type="file" id="importFileInput" accept=".json" style="display:none">
  `;
  return modal;
}
