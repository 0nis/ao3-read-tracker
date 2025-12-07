export function getStyles(prefix: string): string {
  return `
    .${prefix} {
      width: max-content;
      border-right: 1px solid #ddd;
      padding-right: 3em;
    }

    .${prefix}__groups {
      display: flex;
      flex-direction: column;
      gap: 1.5em;
    }

    .${prefix}__group-label {
      font-size: 0.9em;
      font-weight: bold;
      margin: 0 0 0.5em 0;
      color: #333;
    }

    .${prefix} ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding-left: 0;
      margin: 0;
    }

    .${prefix} li {
      margin: 0.5em 0;
    }

    .${prefix} a {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border-bottom: 0px;
    }

    .${prefix} a:hover {
      color: #900;
      border-bottom: 1px solid;
    }

    .${prefix} a.selected {
      color: #900;
      border-bottom: 1px solid;
    }

    .${prefix}-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.6em;
      cursor: pointer;
      padding: 0.25em 0.5em;
    }

    @media (max-width: 800px) {
      .${prefix} {
        width: max-content;
        border-right: 1px solid #ddd;
        padding-right: 3em;
      }
    }

    @media (max-width: 600px) {

      .${prefix} {
        position: relative;
        width: 100%;
        border: none;
        padding: 0;
      }

      .${prefix}-toggle {
        display: block;
        position: relative;
        z-index: 1001;
      }

      .${prefix}--open .${prefix}__groups {
        transform: translateX(0);
      }

      .${prefix}__groups {
        position: absolute;
        top: 100%;
        left: 0;
        height: 100vh;
        min-width: max-content;
        width: 260px;
        background: #fff;
        box-shadow: 2px 0 8px rgba(0,0,0,0.15);
        padding: 1.5em;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        overflow-y: auto;
        z-index: 1000;
        font-size: 1.1em;
      }
    }
  `;
}
