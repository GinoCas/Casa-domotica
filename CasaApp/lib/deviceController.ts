import { Device } from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(): Promise<{ leds: Device[] }> {
  try {
    const response = await GetHandler("living");

    return {
      leds: response.data[0].Leds,
    };
  } catch (error) {
    console.log(error);
    return { leds: [] };
  }
}
