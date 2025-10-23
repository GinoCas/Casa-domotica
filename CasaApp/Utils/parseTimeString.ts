export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString
    .split(":")
    .map((str) => parseInt(str, 10));
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// ISO-8601: YYYY-MM-DDTHH:MM:SSZ
export function parseTimeToISO8601String(date: Date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}
