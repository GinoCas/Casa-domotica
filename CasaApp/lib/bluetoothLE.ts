import { BleManager, Characteristic, Device } from "react-native-ble-plx";
import { PermissionsAndroid } from "react-native";
import { UpdateAllDevices } from "./deviceController";

interface IBluetoothConnection {
  deviceConnected: Device | null;
  deviceID: string;
  serviceUUID: string;
  characteristicUUID: string;
  requestPermissions: () => Promise<boolean>;
  requestEnableBluetooth: () => Promise<void>;
  connectToDevice: () => Promise<Device | null>;
  disconnectDevice: () => Promise<void>;
  startStreamingData: () => Promise<void>;
  sendData: (rawData: any) => Promise<void>;
}

const bleManager = new BleManager();

const bluetoothConnection: IBluetoothConnection = {
  deviceConnected: null,
  deviceID: "01:23:45:67:8D:ED",
  serviceUUID: "0000FFE0-0000-1000-8000-00805F9B34FB",
  characteristicUUID: "0000FFE1-0000-1000-8000-00805F9B34FB",

  requestEnableBluetooth: async () => {
    await bleManager.enable();
  },

  requestPermissions: async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      try {
        await bluetoothConnection.requestEnableBluetooth();
      } catch (error) {
        console.log(error);
      }
      return (
        granted["android.permission.BLUETOOTH_SCAN"] === "granted" &&
        granted["android.permission.BLUETOOTH_CONNECT"] === "granted"
      );
    } catch (error) {
      console.warn("Permissions error:", error);
      return false;
    }
  },

  connectToDevice: async () => {
    if (bluetoothConnection.deviceConnected)
      return bluetoothConnection.deviceConnected;
    try {
      await bluetoothConnection.requestPermissions();
      await new Promise((resolve) => setTimeout(resolve, 500));
      const device = await bleManager.connectToDevice(
        bluetoothConnection.deviceID,
      );
      await device.discoverAllServicesAndCharacteristics();
      bluetoothConnection.deviceConnected = device;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      bluetoothConnection.startStreamingData();
      await UpdateAllDevices();
      console.log("Connected to device:", device.name);
      return device;
    } catch (error) {
      console.error("Error connecting to device:", error);
      return null;
    }
  },

  disconnectDevice: async () => {
    if (!bluetoothConnection.deviceConnected) return;
    await bluetoothConnection.deviceConnected.cancelConnection();
    bluetoothConnection.deviceConnected = null;
    console.log("Disconnected from device.");
  },

  startStreamingData: async () => {
    if (!bluetoothConnection.deviceConnected) return;
    bluetoothConnection.deviceConnected.monitorCharacteristicForService(
      bluetoothConnection.serviceUUID,
      bluetoothConnection.characteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error("Error monitoring characteristic:", error);
          return;
        }

        if (characteristic?.value) {
          const data = atob(characteristic.value);
          console.log("Received data:", data);
        }
      },
    );
  },
  sendData: async (rawData: any) => {
    if (!bluetoothConnection.deviceConnected) {
      console.error("Device isn't connected to send data.");
      return;
    }
    const json = JSON.stringify(rawData) + "\n";
    console.log("DATA" + json);
    try {
      bluetoothConnection.deviceConnected.writeCharacteristicWithResponseForService(
        bluetoothConnection.serviceUUID,
        bluetoothConnection.characteristicUUID,
        btoa(json),
      );
    } catch (error) {}
  },
};

export default bluetoothConnection;
