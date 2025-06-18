import { MonitoringPlugin } from "./pluginInterface";
import { GrafanaPlugin } from "./grafanaPlugin";
import { KibanaPlugin } from "./kibanaPlugin";

export interface MonitoringPluginDefinition {
  name: string;
  type: string;
  options: Record<string, any>;
}

export class PluginManager {
  private plugins: MonitoringPlugin[] = [];

  registerPlugin(def: MonitoringPluginDefinition) {
    let plugin: MonitoringPlugin;

    switch (def.type.toLowerCase()) {
      case "grafana":
        plugin = new GrafanaPlugin();
        break;
      case "kibana":
        plugin = new KibanaPlugin();
        break;
      default:
        throw new Error(`Unsupported plugin type: ${def.type}`);
    }

    plugin.initialize(def.options);
    this.plugins.push(plugin);
  }

  getRegisteredPlugins(): MonitoringPlugin[] {
    return this.plugins;
  }
}
