import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import { ArduinoDeviceDto } from "@/src/application/dtos/ArduinoDeviceDto";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";
import { Device } from "../core/entities/Device";
import { Result } from "../shared/Result";

function applyLocalDevicesState(
  updates: { deviceId: number; newState: boolean }[],
) {
  const start = Date.now();
  const updated = getUpdatedDevicesStates(updates);
  useDeviceStore.getState().handleLoadDevices(updated);
  console.log("setDeviceState took", Date.now() - start, "ms");
}

function applyLocalDevicesBrightness(
  updates: { deviceId: number; brightness: number }[],
) {
  const { handleLoadDevices } = useDeviceStore.getState();
  const updated = getUpdatedDevicesBrightness(updates);
  handleLoadDevices(updated);
}

export function getUpdatedDevicesStates(
  updates: { deviceId: number; newState: boolean }[],
): Device[] {
  const devices = useDeviceStore.getState().devices;
  const updatedDevices: Record<number, Device> = { ...devices };
  for (const { deviceId, newState } of updates) {
    const device = devices[deviceId];
    if (!device) continue;
    updatedDevices[deviceId] = { ...device, state: newState };
  }
  return Object.values(updatedDevices);
}

export function getUpdatedDevicesBrightness(
  updates: { deviceId: number; brightness: number }[],
): Device[] {
  const devices = useDeviceStore.getState().devices;
  const updatedDevices: Record<number, Device> = { ...devices };

  for (const { deviceId, brightness } of updates) {
    const device = devices[deviceId];
    if (!device) continue;

    const updatedCapabilities = device.capabilities.map((c) =>
      c.capabilityType === "Dimmable" ? { ...c, brightness } : c,
    );

    updatedDevices[deviceId] = { ...device, capabilities: updatedCapabilities };
  }

  return Object.values(updatedDevices);
}

export async function toggleDevice(deviceId: number, newState: boolean) {
  const result = await deviceService.controlDevice([
    new ArduinoDeviceDto(deviceId, newState),
  ]);
  if (result.isSuccess) {
    applyLocalDevicesState([{ deviceId, newState }]);
  } else {
    console.error("Error toggling device state:", result.errors);
  }
}

export async function toggleDevices(
  updates: { deviceId: number; newState: boolean }[],
) {
  const dtos = updates.map((u) => new ArduinoDeviceDto(u.deviceId, u.newState));
  const result = await deviceService.controlDevice(dtos);
  if (result.isSuccess) {
    applyLocalDevicesState(updates);
  }
}

export async function setDeviceBrightness(
  deviceId: number,
  brightness: number,
) {
  const result = await deviceService.controlDevice([
    new ArduinoDeviceDto(deviceId, true, "", brightness),
  ]);

  if (result.isSuccess) {
    applyLocalDevicesBrightness([{ deviceId, brightness }]);
  } else {
    console.error(
      `Error setting brightness for device ${deviceId}:`,
      result.errors,
    );
  }
}

export function getDeviceById(deviceId: number): Result<Device> {
  const device = useDeviceStore.getState().devices[deviceId];
  if (!device) {
    return Result.failure([
      "El dispositivo con ID: " + deviceId + " no fue encontrado",
    ]);
  }
  return Result.success(device);
}

export async function updateDevice(deviceId: number, dto: DeviceDto) {
  const { changeLoadingDevices, handleLoadDevices } = useDeviceStore.getState();
  try {
    changeLoadingDevices(true);
    const result = await deviceService.updateDevice(deviceId, dto);
    if (!result.isSuccess) {
      throw new Error(result.errors.join(", "));
    }
  } catch (err) {
    console.log("Error on updating device:" + err);
  } finally {
    changeLoadingDevices(false);
  }
  const devicesResult = await deviceService.getDeviceList();
  if (!devicesResult.isSuccess) {
    console.log("Error on loading devices", devicesResult.errors);
    return;
  }
  handleLoadDevices(devicesResult.data);
}

export async function refreshDevices() {
  const { changeLoadingDevices, handleLoadDevices } = useDeviceStore.getState();
  try {
    changeLoadingDevices(true);
    const devicesResult = await deviceService.getDeviceList();
    if (!devicesResult.isSuccess) {
      console.log("Error on loading devices", devicesResult.errors);
      return;
    }
    handleLoadDevices(devicesResult.data);
  } finally {
    changeLoadingDevices(false);
  }
}
