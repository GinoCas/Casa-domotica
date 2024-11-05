export class Response {
  constructor(data, cdRes, dsRes, errors, alerts) {
    this.data = data;
    this.cdRes = cdRes;
    this.dsRes = dsRes;
    this.errors = errors;
    this.alerts = alerts;
  }
}
