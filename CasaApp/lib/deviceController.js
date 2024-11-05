import { GetHandler } from "../Utils/apiHandlers.js";

export async function GetDeviceList() {
  try {
    const response = await GetHandler("living");
    const connectedLeds = response.data[0].Leds.map((led) => {
      const { Id, Pin, State, Brightness, Voltage, Energy } = led;
      return {
        id: Id,
        pin: Pin,
        state: State,
        brightness: Brightness,
        voltage: Voltage,
        energy: Energy,
      };
    });
    return {
      leds: connectedLeds,
    };
  } catch (error) {
    return error;
  }
}
