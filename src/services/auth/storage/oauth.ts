import { LocalMemoryService } from "../../memory";
import { ABBREVIATION } from "../../../constants/global";

export type OAuthState = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export class OAuthStateStore {
  constructor(
    private key: string,
    private memory: LocalMemoryService,
  ) {
    key = `${ABBREVIATION.toLocaleLowerCase()}.oauth-state-${key}`;
  }

  get(): OAuthState | null {
    return this.memory.get<OAuthState>(this.key);
  }

  set(state: OAuthState): void {
    this.memory.set(this.key, state);
  }

  clear(): void {
    this.memory.delete(this.key);
  }
}
