export interface MonitoringAlert {
  title: string;
  message: string;
  severity?: "info" | "warning" | "critical";
  alertRuleId?: string;
  viewUrl?: string;
  [key: string]: any;
}

export interface PluginStatus {
  healthy: boolean;
  details?: string;
}

export interface MonitoringPlugin {
  initialize(config: Record<string, any>): Promise<void>;
  fetchAlerts(): Promise<MonitoringAlert[]>;
  getStatus?(): Promise<PluginStatus>;
}
