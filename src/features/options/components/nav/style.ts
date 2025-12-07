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
        position: absolute;
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
        right: -3.5%;
        height: 100vh;
        width: max-content;

        transform: translateX(100%);
        transition: transform 0.25s ease;

        z-index: 1000;
        overflow-y: auto;
        font-size: 1.1em;
        background: #fff;
        box-shadow: 2px 0 8px rgba(0,0,0,0.15);
        padding: 1.5em;
      }
    }
  `;
}
