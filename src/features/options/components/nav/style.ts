export function getStyles(prefix: string): string {
  return `
    .${prefix} {
      width: max-content;
      border-right: 1px solid #ddd;
      padding-right: 3em;
    }

    .${prefix}__header {
      display: none;
      font-size: 1.6em;
      margin: .8em 0;
    }

    .${prefix}__groups {
      display: flex;
      flex-direction: column;
      gap: 1.5em;
      padding: .5em 0;
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
      margin-top: 0.429em;
      align-self: start;
    }

    @media (max-width: 600px) {
      .${prefix} {
        position: absolute;
        top: -1.5em;
        right: -3.5%;

        height: calc(100% + 2em);
        min-height: inherit;
        width: max-content;
        min-width: 14em;

        transform: translateX(100%);
        transition: transform 0.25s ease;

        background: #fff;
        box-shadow: 0 0 1em rgba(0,0,0,0.15);

        border: none;
        padding: 1.5em;
        overflow-y: auto;
        z-index: 1000;
      }

      .${prefix}__header {
        display: block;
      }

      .${prefix}-toggle {
        display: block;
        position: relative;
        z-index: 1001;
      }

      .${prefix}--open {
        transform: translateX(0);
      }
    }
  `;
}
