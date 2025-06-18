export interface MonitoringPlugin {
  initialize(config: Record<string, any>): Promise<void>;
  fetchAlerts(): Promise<any[]>;
}
