import { MonitoringPlugin, MonitoringAlert } from './pluginInterface';

export class GrafanaPlugin implements MonitoringPlugin {
  private config: Record<string, any> = {};

  async initialize(config: Record<string, any>): Promise<void> {
    this.config = config;
  }

  async fetchAlerts(): Promise<MonitoringAlert[]> {
    const { url, apiKey, alertRuleId, viewUrl } = this.config;
    return [
      {
        title: "Grafana CPU Alert",
        message: `Fetched from ${url}`,
        severity: "critical",
        alertRuleId,
        viewUrl
      }
    ];
  }
}
