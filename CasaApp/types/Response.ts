interface IResult<T> {
  data: T;
  isSuccess: boolean;
  errors: string[];
}

export class Result<T> implements IResult<T> {
  constructor(
    public data: T,
    public isSuccess: boolean,
    public errors: string[],
  ) {}
  static success<T>(data: T): Result<T> {
    return new Result(data, true, []);
  }

  static failure<T>(errors: string[]): Result<T> {
    return new Result<T>(null as any, false, errors);
  }
}
