import { AuthProviderType } from "../../shared/enums";
import { OAuthStoredState } from "../../oauth/types";
import { extensionStorage } from "../../../extension";
import { ABBREVIATION } from "../../../../constants/global";

export class OAuthTokenStore {
  private key: string;

  constructor(provider: AuthProviderType) {
    this.key = `${ABBREVIATION.toLowerCase()}.oauth-state-${provider}`;
  }

  get(): Promise<OAuthStoredState | null> {
    return extensionStorage.get<OAuthStoredState>(this.key);
  }

  set(state: OAuthStoredState): Promise<void> {
    return extensionStorage.set(this.key, state);
  }

  clear(): Promise<void> {
    return extensionStorage.delete(this.key);
  }
}
