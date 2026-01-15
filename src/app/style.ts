import { DEFAULT_SYMBOL_SIZE_EM } from "../constants/global";

export function getGlobalStyles(prefix: string): string {
  return `
    .${prefix}__hidden {
      display: none !important;
    }

    body.${prefix}__lock-scroll {
      overflow: hidden;
    }

    .${prefix}__button {
      cursor: pointer;
    }
    .${prefix}__button:hover {
      color: #900;
      border-top: 1px solid #999;
      border-left: 1px solid #999;
      box-shadow: inset 2px 2px 2px #bbb;
    }
    .${prefix}__button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .${prefix}__button--danger {
      color: #900 !important;
      border-color: #900 !important;
    }

    .${prefix}__select {
      font: 100% 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont';
      border: 1px solid #bbb;
      box-shadow: inset 0 1px 2px #ccc;
    }

    .${prefix}__inline-image {
      display: inline-block;
      height: ${DEFAULT_SYMBOL_SIZE_EM}em;
      vertical-align: -0.25em;
      object-fit: contain;
    }

    .${prefix}__suffix {
      margin-left: 2px;
    }

    .${prefix}__sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      margin: -1px !important;
      padding: 0 !important;
      border: 0 !important;
      white-space: nowrap !important;
      clip-path: inset(50%) !important;
      clip: rect(0 0 0 0) !important;
      overflow: hidden !important;
    }

  `;
}
