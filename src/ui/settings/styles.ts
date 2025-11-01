export function addModalStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    .read-tracker__overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 98;
    }
    .read-tracker__modal {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: inherit;
      color: inherit;
      padding: 20px;
      box-shadow: 0 0 30px;
      box-sizing: border-box;
      max-height: 100%;
      max-width: 100%;
      overflow: auto;
      z-index: 99;
    }
    .read-tracker__header {
      display: flex;
      justify-content: space-between;
    }
    .read-tracker__settings {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 3px;
      margin-bottom: 3px;
    }
    .read-tracker__btn:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    .hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
