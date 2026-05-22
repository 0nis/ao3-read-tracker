import { DeviceFlowStartResponse } from "../../oauth/device/types";
import { DeviceFlowStatus } from "../../shared/enums";

export interface AuthProxy {
  isAuthenticated(): Promise<boolean>;
  disconnect(): Promise<void>;
}

export interface DeviceAuthProxy extends AuthProxy {
  startDeviceFlow(): Promise<DeviceFlowStartResponse>;
  pollDeviceFlow(): Promise<DeviceFlowStatus>;
}
