export default function getTimeString(dateParam: Date) {
  const horas = String(dateParam.getHours()).padStart(2, "0");
  const minutos = String(dateParam.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}
