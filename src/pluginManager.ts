import * as path from 'path';
import * as fs from 'fs';
import { MonitoringPlugin } from './base/MonitoringPlugin';

interface PluginConfig {
  name: string;
  path: string;
  options: any;
}

export default class PluginManager {
  private plugins = new Map<string, MonitoringPlugin>();

  constructor(basePath: string) {
    const configPath = path.join(basePath, 'plugin-config.json');
    const configs: PluginConfig[] = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    for (const cfg of configs) {
      const PluginClass = require(path.join(basePath, 'src', cfg.path)).default;
      const instance = new PluginClass(cfg.options);
      this.plugins.set(cfg.name, instance);
    }
  }

  getPlugin(name: string): MonitoringPlugin | undefined {
    return this.plugins.get(name);
  }

  listPlugins(): string[] {
    return [...this.plugins.keys()];
  }
}
