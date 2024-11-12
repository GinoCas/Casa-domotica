import Device from "@/types/Device";
import DevicesData from "@/stores/devices.json";

export function GetDeviceList(): Device[] {
  return DevicesData as Device[];
}

export async function UpdateDevice(updatedDevice: Device) {
  const deviceIndex = DevicesData.findIndex(
    (device) => device.baseProperties.id === updatedDevice.baseProperties.id,
  );
  DevicesData[deviceIndex] = {
    ...DevicesData[deviceIndex],
    ...updatedDevice,
    baseProperties: {
      ...DevicesData[deviceIndex].baseProperties,
      ...updatedDevice.baseProperties,
    },
  };
  return;
}
