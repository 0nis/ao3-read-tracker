import { DeviceAuthProxy } from "../../base/proxy";
import {
  AuthMessageType,
  AuthProviderType,
  DeviceFlowStatus,
} from "../../../shared/enums";
import {
  AuthDisconnectResponse,
  AuthPollResponse,
  AuthStatusResponse,
} from "../../../shared/types";
import { DeviceFlowStartResponse } from "../../../oauth/device/types";
import { sendRuntimeMessage } from "../../../../../utils/runtime";

export class GoogleDeviceAuthProxy implements DeviceAuthProxy {
  readonly provider = AuthProviderType.GOOGLE;
  readonly supportsDeviceFlow = true;

  async startDeviceFlow(): Promise<DeviceFlowStartResponse> {
    return await sendRuntimeMessage<DeviceFlowStartResponse>({
      type: AuthMessageType.START_DEVICE_FLOW,
      provider: AuthProviderType.GOOGLE,
    });
  }

  async pollDeviceFlow(): Promise<DeviceFlowStatus> {
    const response = await sendRuntimeMessage<AuthPollResponse>({
      type: AuthMessageType.POLL_DEVICE_FLOW,
      provider: AuthProviderType.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);

    return response.status;
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await sendRuntimeMessage<AuthStatusResponse>({
      type: AuthMessageType.STATUS,
      provider: AuthProviderType.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);

    return response.authenticated;
  }

  async disconnect(): Promise<void> {
    const response = await sendRuntimeMessage<AuthDisconnectResponse>({
      type: AuthMessageType.DISCONNECT,
      provider: AuthProviderType.GOOGLE,
    });
    if (!response.ok) throw new Error(response.error);
  }
}
