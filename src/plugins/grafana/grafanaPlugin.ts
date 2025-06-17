import axios from 'axios';
import { MonitoringPlugin } from '../../base/MonitoringPlugin';

export default class GrafanaPlugin extends MonitoringPlugin {
  async getAlerts(): Promise<any> {
    try {
      const response = await axios.get(this.options.url, {
        headers: { Authorization: `Bearer ${this.options.token}` }
      });
      return response.data;
    } catch {
      return [{ message: "Failed to fetch Grafana alerts" }];
    }
  }

  async getStatus(): Promise<any> {
    return { status: "Grafana is active" };
  }
}
