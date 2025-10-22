export interface AutomationDevice {
  id: number;
  autoState: boolean;
}

export class Automation {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly initTime: string,
    public readonly endTime: string,
    public readonly devices: AutomationDevice[],
    public readonly state: boolean,
    public readonly days: number,
  ) {
    this.devices = devices ?? [];
  }

  addDevice(deviceId: number): Automation {
    if (this.devices.find((d) => d.id === deviceId)) {
      return this;
    }
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      this.endTime,
      [...this.devices, { id: deviceId, autoState: true }],
      this.state,
      this.days,
    );
  }

  removeDevice(deviceId: number): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      this.endTime,
      this.devices.filter((d) => d.id !== deviceId),
      this.state,
      this.days,
    );
  }

  withDevices(devices: AutomationDevice[]): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      this.endTime,
      [...devices],
      this.state,
      this.days,
    );
  }
  withName(name: string): Automation {
    const auto = new Automation(
      this.id,
      name,
      this.description,
      this.initTime,
      this.endTime,
      this.devices,
      this.state,
      this.days,
    );
    return auto;
  }

  withDescription(description: string): Automation {
    return new Automation(
      this.id,
      this.name,
      description,
      this.initTime,
      this.endTime,
      this.devices,
      this.state,
      this.days,
    );
  }

  withInitTime(initTime: string): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      initTime,
      this.endTime,
      this.devices,
      this.state,
      this.days,
    );
  }

  withEndTime(endTime: string): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      endTime,
      this.devices,
      this.state,
      this.days,
    );
  }

  withState(state: boolean): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      this.endTime,
      this.devices,
      state,
      this.days,
    );
  }

  withDays(days: number): Automation {
    return new Automation(
      this.id,
      this.name,
      this.description,
      this.initTime,
      this.endTime,
      this.devices,
      this.state,
      days,
    );
  }

  static fromApiResponse(data: any): Automation {
    const toLocalHHmmFromUtc = (time?: string): string => {
      if (!time) return "";
      const [h, m] = time.split(":").map(Number);
      const d = new Date(Date.UTC(2000, 0, 1, h, m)); // año/mes/día irrelevante
      const hh = d.toLocaleString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      return hh;
    };
    return new Automation(
      data.id,
      data.name,
      data.description,
      toLocalHHmmFromUtc(data.initTime),
      toLocalHHmmFromUtc(data.endTime),
      data.devices ?? [],
      data.state,
      data.days ?? 0,
    );
  }
}
