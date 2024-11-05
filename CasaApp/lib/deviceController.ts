import { Led } from "@/types/Device";
import { GetHandler } from "@/Utils/apiHandlers";

export async function GetDeviceList(): Promise<{ leds: Led[] }> {
  try {
    const response = await GetHandler("room/living");
    return {
      leds: response.data[0].Leds,
    };
  } catch (error) {
    console.log(error);
    return { leds: [] };
  }
}
