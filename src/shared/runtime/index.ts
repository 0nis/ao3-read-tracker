import { boot } from "./boot";
import { reload } from "./recovery";
import { kill } from "./lifecycle";
import { isAlive } from "./state";

export const ExtensionRuntime = {
  boot,
  reload,
  kill,
  isAlive,
};
