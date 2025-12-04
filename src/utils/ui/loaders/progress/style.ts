export function getStyles(prefix: string) {
  return `
    .${prefix} {
      position: relative;
      display: inline-block;
      min-width: 3em;
      width: 100%;
      height: 0.4em;
      background: rgba(0,0,0,0.15);
      border-radius: 2px;
      overflow: hidden;
      vertical-align: middle;
    }

    .${prefix}__bar {
      display: block;
      height: 100%;
      width: 0%;
      background: currentColor;
      transition: width 0.15s linear;
    }
  `;
}
