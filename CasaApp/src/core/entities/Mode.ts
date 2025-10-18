export class Mode {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly state: boolean,
    public readonly lastChanged: string,
  ) {}

  static fromApiResponse(data: any): Mode {
    return new Mode(
      data.id,
      data.name,
      data.state,
      data.lastChanged ?? data.last_changed ?? data.lastchange ?? data.lastChangedAt,
    );
  }
}