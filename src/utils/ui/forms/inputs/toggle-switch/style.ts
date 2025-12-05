export function getStyles(prefix: string) {
  return `
    .${prefix} {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }

    .${prefix} input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .${prefix}__slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: #ccc;
      transition: 0.2s;
      border-radius: 20px;
    }

    .${prefix}__slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      top: 2px;
      background: white;
      transition: 0.2s;
      border-radius: 50%;
    }

    .${prefix} input:checked + .${prefix}__slider {
      background: #900;
    }

    .${prefix} input:checked + .${prefix}__slider:before {
      transform: translateX(20px);
    }
  `;
}
