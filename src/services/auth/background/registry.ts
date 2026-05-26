import { AuthProviderType } from "../shared/enums";
import { AnyAuthHandler } from "../providers/base";

import { GoogleDeviceAuthHandler } from "../providers/google/device/handler";

type AuthHandlerFactory = () => AnyAuthHandler;

export class AuthHandlerRegistry {
  private readonly factories: Partial<
    Record<AuthProviderType, AuthHandlerFactory>
  > = {
    [AuthProviderType.GOOGLE]: () => new GoogleDeviceAuthHandler(),
  };

  private readonly handlers = new Map<AuthProviderType, AnyAuthHandler>();

  get(provider: AuthProviderType): AnyAuthHandler {
    const existing = this.handlers.get(provider);
    if (existing) return existing;

    const factory = this.factories[provider];
    if (!factory)
      throw new Error(`Unsupported auth provider: ${String(provider)}`);

    const handler = factory();
    this.handlers.set(provider, handler);

    return handler;
  }
}

export const authHandlerRegistry = new AuthHandlerRegistry();
