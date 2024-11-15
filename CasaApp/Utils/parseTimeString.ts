export function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString
    .split(":")
    .map((str) => parseInt(str, 10));
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
