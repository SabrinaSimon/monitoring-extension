export abstract class MonitoringPlugin {
  protected options: any;

  constructor(options: any) {
    this.options = options;
  }

  abstract getAlerts(): Promise<any>;
  abstract getStatus(): Promise<any>;
}
