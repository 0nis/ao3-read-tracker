export enum AuthProviderType {
  GOOGLE = "google",
}

export enum AuthMessageType {
  START_DEVICE_FLOW = "auth:start-device-flow",
  POLL_DEVICE_FLOW = "auth:poll-device-flow",

  START_REDIRECT_FLOW = "auth:start-redirect-flow",
  COMPLETE_REDIRECT_FLOW = "auth:complete-redirect-flow",

  DISCONNECT = "auth:disconnect",
  STATUS = "auth:status",
}
