import { MonitoringPlugin } from './pluginInterface';

export interface MonitoringPluginDefinition {
  name: string;
  type: string;
  options: Record<string, any>;
}

export class PluginManager {
  private plugins: MonitoringPlugin[] = [];

  registerPlugin(def: MonitoringPluginDefinition) {
    let pluginClass;
    switch (def.type.toLowerCase()) {
      case 'grafana':
        pluginClass = require('./grafanaPlugin').GrafanaPlugin;
        break;
      case 'kibana':
        pluginClass = require('./kibanaPlugin').KibanaPlugin;
        break;
      default:
        throw new Error(`Unknown plugin type: ${def.type}`);
    }
    
    const instance: MonitoringPlugin = new pluginClass();
    instance.initialize(def.options);
    this.plugins.push(instance);
  }

  getRegisteredPlugins(): MonitoringPlugin[] {
    return this.plugins;
  }
}
