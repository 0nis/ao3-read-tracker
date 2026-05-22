export enum AuthProviderType {
  GOOGLE = "google",
}

export enum AuthMessageType {
  START_DEVICE_FLOW = "auth:start-device-flow",
  POLL_DEVICE_FLOW = "auth:poll-device-flow",
  DISCONNECT = "auth:disconnect",
  STATUS = "auth:status",
}

export enum DeviceFlowStatus {
  PENDING = "pending",
  COMPLETE = "complete",
  EXPIRED = "expired",
}
