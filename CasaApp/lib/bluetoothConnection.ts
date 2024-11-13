import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid } from "react-native";

interface IBluetoothConnection {
  deviceConnected: Device | null;
  deviceID: string;
  serviceUUID: string;
  characteristicUUID: string;
  requestPermissions: () => Promise<boolean>;
  requestEnableBluetooth: () => Promise<void>;
  connectToDevice: () => Promise<Device | null>;
  disconnectDevice: () => Promise<void>;
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
      bluetoothConnection.requestEnableBluetooth();
      return (
        granted["android.permission.BLUETOOTH_SCAN"] === "granted" &&
        granted["android.permission.BLUETOOTH_CONNECT"] === "granted"
      );
    } catch (error) {
      console.warn("Permissions error:", error);
      return false;
    }
  },

  connectToDevice: async function () {
    if (this.deviceConnected) return this.deviceConnected;
    try {
      const device = await bleManager.connectToDevice(this.deviceID);
      await device.discoverAllServicesAndCharacteristics();
      this.deviceConnected = device;
      console.log("Connected to device:", device.name);
      return device;
    } catch (error) {
      console.error("Error connecting to device:", error);
      return null;
    }
  },

  disconnectDevice: async function () {
    if (!this.deviceConnected) return;
    await this.deviceConnected.cancelConnection();
    this.deviceConnected = null;
    console.log("Disconnected from device.");
  },
};

export default bluetoothConnection;
