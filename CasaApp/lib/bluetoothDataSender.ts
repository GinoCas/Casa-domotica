import bluetoothConnection from "@/lib/bluetoothConnection";


export async function sendData(data: any): Promise<void> {
  const device = await bluetoothConnection.connectToDevice();
  if (!device) {
    console.error("Couldn't connect to the device.");
    return;
  }

  try {
    console.log(data);
  } catch (error) {}
}
