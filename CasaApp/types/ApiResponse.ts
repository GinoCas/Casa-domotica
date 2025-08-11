export default interface ApiResponse<T> {
  data: T;
  errors: string[];
  alerts: string[];
}
