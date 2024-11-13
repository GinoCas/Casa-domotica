import bluetoothConnection from "@/lib/bluetoothConnection";

export async function sendData(rawData: any): Promise<void> {
  const device = await bluetoothConnection.connectToDevice();
  if (!device) {
    console.error("Couldn't connect to the device.");
    return;
  }
  const json = JSON.stringify(rawData) + "\n";
  console.log("DATA" + json);
  try {
    device.writeCharacteristicWithResponseForService(
      bluetoothConnection.serviceUUID,
      bluetoothConnection.characteristicUUID,
      btoa(json)
    );
  } catch (error) {}
}
