import { AuthProviderType } from "../shared/enums";
import { AnyAuthHandler } from "./base/handler";

import { GoogleDeviceAuthHandler } from "./google/device/handler";

// TODO: Let providers register themselves

const authProviders = {
  [AuthProviderType.GOOGLE]: new GoogleDeviceAuthHandler(),
} satisfies Partial<Record<AuthProviderType, AnyAuthHandler>>;

export function getAuthProvider(provider: AuthProviderType): AnyAuthHandler {
  const AuthProviderType = authProviders[provider];

  if (!AuthProviderType)
    throw new Error(`Unsupported auth provider: ${String(provider)}`);

  return AuthProviderType;
}

export function getAuthProviders(): Partial<
  Record<AuthProviderType, AnyAuthHandler>
> {
  return authProviders;
}
