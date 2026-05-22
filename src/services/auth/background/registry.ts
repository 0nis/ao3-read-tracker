import { AuthProviderType } from "../shared/enums";
import { AnyAuthHandler } from "../providers/base/handler";

import { GoogleDeviceAuthHandler } from "../providers/google/device/handler";

export class AuthHandlerRegistry {
  private readonly handlers: Partial<Record<AuthProviderType, AnyAuthHandler>> =
    {
      [AuthProviderType.GOOGLE]: new GoogleDeviceAuthHandler(),
    };

  get(provider: AuthProviderType): AnyAuthHandler {
    const handler = this.handlers[provider];

    if (!handler)
      throw new Error(`Unsupported auth provider: ${String(provider)}`);

    return handler;
  }
}

export const authHandlerRegistry = new AuthHandlerRegistry();
