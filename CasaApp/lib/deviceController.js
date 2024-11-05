import { err } from "react-native-svg";
import { GetHandler } from "../Utils/apiHandlers.js";
import { Response } from "../Utils/responseFormat.js";

export async function GetDeviceList() {
  try {
    const json = await GetHandler("living");
    /*const { data, cdRes, dsRes, errors, alerts } = components[0];
      console.log("Test:" + components[0]);*/
    return [json];
  } catch (error) {
    return error;
  }
}
