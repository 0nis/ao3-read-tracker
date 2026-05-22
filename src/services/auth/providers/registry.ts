import { AuthProvider } from "../shared/enums";
import { AnyAuthHandler } from "./base/handler";

import { GoogleDeviceAuthHandler } from "./google/device/handler";

// TODO: Let providers register themselves

const authProviders = {
  [AuthProvider.GOOGLE]: new GoogleDeviceAuthHandler(),
} satisfies Partial<Record<AuthProvider, AnyAuthHandler>>;

export function getAuthProvider(provider: AuthProvider): AnyAuthHandler {
  const authProvider = authProviders[provider];

  if (!authProvider)
    throw new Error(`Unsupported auth provider: ${String(provider)}`);

  return authProvider;
}

export function getAuthProviders(): Partial<
  Record<AuthProvider, AnyAuthHandler>
> {
  return authProviders;
}
