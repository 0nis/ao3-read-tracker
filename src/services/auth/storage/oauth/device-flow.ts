import { AuthProviderType } from "../../shared/enums";
import { extensionStorage } from "../../../extension";
import { ABBREVIATION } from "../../../../constants/global";

export type StoredDeviceFlowState = {
  provider: AuthProviderType;
  deviceCode: string;
  userCode: string;
  verificationUrl: string;
  expiresAt: number;
  interval: number;
  lastPollAt?: number;
};

export class OAuthDeviceFlowStore {
  private key: string;

  constructor(provider: AuthProviderType) {
    this.key = `${ABBREVIATION.toLowerCase()}.oauth-device-flow-${provider}`;
  }

  get(): Promise<StoredDeviceFlowState | null> {
    return extensionStorage.get<StoredDeviceFlowState>(this.key);
  }

  set(state: StoredDeviceFlowState): Promise<void> {
    return extensionStorage.set(this.key, state);
  }

  clear(): Promise<void> {
    return extensionStorage.delete(this.key);
  }
}
