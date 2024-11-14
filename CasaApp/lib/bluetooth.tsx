import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid } from "react-native";

const BluetoothApp = () => {
  const [manager, setManager] = useState<BleManager | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const deviceID = "01:23:45:67:8D:ED";
  const characteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";
  const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";

  useEffect(() => {
    const bleManager = new BleManager();
    setManager(bleManager);
    requestPermission();
    return () => {
      bleManager.destroy();
    };
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted["android.permission.BLUETOOTH_SCAN"] !== "granted" ||
        granted["android.permission.BLUETOOTH_CONNECT"] !== "granted"
      ) {
        alert("Bluetooth permissions weren't granted.");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const connectToDevice = async () => {
    if (!manager) return;
    try {
      const connectedDevice = await manager.connectToDevice(deviceID);
      setDevice(connectedDevice);
      setConnected(true);
      setMessage("Device Connected");
      await connectedDevice.discoverAllServicesAndCharacteristics();
      connectedDevice.onDisconnected(() => {
        clearInterval(intervalToRead);
      });
      const intervalToRead = setInterval(async () => {
        try {
          const characteristic =
            await connectedDevice.readCharacteristicForService(
              serviceUUID,
              characteristicUUID
            );

          const rawData = characteristic.value;
          if (rawData) {
            const decodedData = atob(rawData);
            setMessage(`Received info: ${decodedData}`);
          } else {
            setMessage("No new data received.");
          }
        } catch (error) {
          console.error("Error reading characteristic:", error);
          setMessage("Error when reading characteristic.");
        }
      }, 1000);
      return () => clearInterval(intervalToRead);
    } catch (error) {
      console.error("Error connecting to device:", error);
      setMessage("Error connecting to device.");
    }
  };

  const disconnectDevice = async () => {
    if (device) {
      await device.cancelConnection();
      setDevice(null);
      setConnected(false);
      setMessage("Disconnected");
    }
  };

  return (
    <View>
      <Text>{message}</Text>
      {!connected ? (
        <Button title="Connect" onPress={connectToDevice} />
      ) : (
        <Button title="Disconnect" onPress={disconnectDevice} />
      )}
    </View>
  );
};

export default BluetoothApp;
