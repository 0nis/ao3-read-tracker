import { AuthMessageType, AuthProviderType } from "../shared/enums";
import { DeviceFlowStatus } from "../oauth/device/enums";
import { AuthDisconnectResponse, AuthStatusResponse } from "../shared/types";
import {
  DeviceFlowStartResponse,
  DeviceFlowPollResponse,
} from "../oauth/device/types";
import { sendRuntimeMessage } from "../../../utils/runtime";

export class AuthRuntimeProxy {
  constructor(private readonly provider: AuthProviderType) {}

  async startDeviceFlow(): Promise<DeviceFlowStartResponse> {
    return await sendRuntimeMessage<DeviceFlowStartResponse>({
      type: AuthMessageType.START_DEVICE_FLOW,
      provider: this.provider,
    });
  }

  async pollDeviceFlow(): Promise<DeviceFlowStatus> {
    const response = await sendRuntimeMessage<DeviceFlowPollResponse>({
      type: AuthMessageType.POLL_DEVICE_FLOW,
      provider: this.provider,
    });

    if (!response.ok) throw new Error(response.error);

    return response.status;
  }

  async isAuthenticated(): Promise<boolean> {
    const response = await sendRuntimeMessage<AuthStatusResponse>({
      type: AuthMessageType.STATUS,
      provider: this.provider,
    });

    if (!response.ok) throw new Error(response.error);

    return response.authenticated;
  }

  async disconnect(): Promise<void> {
    const response = await sendRuntimeMessage<AuthDisconnectResponse>({
      type: AuthMessageType.DISCONNECT,
      provider: this.provider,
    });

    if (!response.ok) throw new Error(response.error);
  }

  async startRedirectFlow(): Promise<unknown> {
    return Promise.reject("Redirect flows not supported yet");
  }

  async completeRedirectFlow(): Promise<void> {
    return Promise.reject("Redirect flows not supported yet");
  }
}
