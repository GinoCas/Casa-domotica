import useDeviceStore from "@/stores/useDeviceStore";
import { deviceService } from "@/src/services/DeviceService";
import { ArduinoDeviceDto } from "@/src/application/dtos/ArduinoDeviceDto";
import { DeviceDto } from "@/src/application/dtos/DeviceDto";

export async function toggleDevice(deviceId: number, newState: boolean) {
  const { setDeviceState } = useDeviceStore.getState();

  // Optimistic update with timing for performance visibility
  const result = await deviceService.controlDevice(
    new ArduinoDeviceDto(deviceId, newState),
  );
  if (result.isSuccess) {
    const start = Date.now();
    setDeviceState(deviceId, newState);
    const updateMs = Date.now() - start;
    console.log("setDeviceState took", updateMs, "ms");
  } else {
    console.error("Error toggling device state:", result.errors);
  }
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
