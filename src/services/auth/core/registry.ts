import { AuthProviderType } from "../shared/enums";
import { AnyAuthProxy } from "../providers/base/proxy";

import { GoogleDeviceAuthProxy } from "../providers/google/device/proxy";

export class AuthProxyRegistry {
  private readonly proxies: Partial<Record<AuthProviderType, AnyAuthProxy>> = {
    [AuthProviderType.GOOGLE]: new GoogleDeviceAuthProxy(),
  };

  get(provider: AuthProviderType): AnyAuthProxy {
    const proxy = this.proxies[provider];

    if (!proxy)
      throw new Error(`Unsupported auth provider: ${String(provider)}`);

    return proxy;
  }
}

export const authProxyRegistry = new AuthProxyRegistry();
