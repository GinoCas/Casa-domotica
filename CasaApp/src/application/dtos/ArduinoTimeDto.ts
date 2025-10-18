export type ArduinoTimeDto = {
  Hour: number;
  Minute: number;
  Second: number;
  WeekDay: number; // 0=Domingo..6=Sabado (JS Date.getDay())
};