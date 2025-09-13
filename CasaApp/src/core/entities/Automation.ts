export interface AutomationDevice {
  id: number;
  autoState: boolean;
}

export class Automation {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly initTime: string,
    public readonly endTime: string,
    public readonly devices: AutomationDevice[],
    public readonly state: boolean,
  ) {
    this.devices = devices ?? [];
  }

  addDevice(deviceId: number): Automation {
    if (this.devices.find((d) => d.id === deviceId)) {
      return this;
    }
    return new Automation(
      this.id,
      this.title,
      this.description,
      this.initTime,
      this.endTime,
      [...this.devices, { id: deviceId, autoState: true }],
      this.state,
    );
  }

  removeDevice(deviceId: number): Automation {
    return new Automation(
      this.id,
      this.title,
      this.description,
      this.initTime,
      this.endTime,
      this.devices.filter((d) => d.id !== deviceId),
      this.state,
    );
  }

  withDevices(devices: AutomationDevice[]): Automation {
    return new Automation(
      this.id,
      this.title,
      this.description,
      this.initTime,
      this.endTime,
      [...devices],
      this.state,
    );
  }
  withTitle(title: string): Automation {
    return new Automation(
      this.id,
      title,
      this.description,
      this.initTime,
      this.endTime,
      this.devices,
      this.state,
    );
  }

  withDescription(description: string): Automation {
    return new Automation(
      this.id,
      this.title,
      description,
      this.initTime,
      this.endTime,
      this.devices,
      this.state,
    );
  }

  withInitTime(initTime: string): Automation {
    return new Automation(
      this.id,
      this.title,
      this.description,
      initTime,
      this.endTime,
      this.devices,
      this.state,
    );
  }

  withEndTime(endTime: string): Automation {
    return new Automation(
      this.id,
      this.title,
      this.description,
      this.initTime,
      endTime,
      this.devices,
      this.state,
    );
  }

  withState(state: boolean): Automation {
    return new Automation(
      this.id,
      this.title,
      this.description,
      this.initTime,
      this.endTime,
      this.devices,
      state,
    );
  }

  static fromApiResponse(data: any): Automation {
    return new Automation(
      data.id,
      data.name,
      data.description,
      data.initTime,
      data.endTime,
      data.devices ?? [],
      data.state,
    );
  }
}
