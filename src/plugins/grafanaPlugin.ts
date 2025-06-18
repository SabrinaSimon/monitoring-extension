import { MonitoringPlugin } from './pluginInterface';

export class GrafanaPlugin implements MonitoringPlugin {
  private config: any;

  async initialize(config: Record<string, any>): Promise<void> {
    this.config = config;
  }

  async fetchAlerts(): Promise<any[]> {
    const { url, apiKey, alertRuleId, viewUrl } = this.config;
    return [
      {
        title: "Grafana Alert",
        message: `Fetched from ${url}`,
        alertRuleId,
        viewUrl
      }
    ];
  }
}
