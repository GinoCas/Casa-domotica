export default interface ApiResponse<T> {
  data: T;
  cdRes: string;
  dsRes: string;
  errors: string[];
  alerts: string[];
}
