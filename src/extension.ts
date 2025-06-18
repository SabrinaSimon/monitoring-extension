import * as vscode from 'vscode';
import { PluginManager, MonitoringPluginDefinition } from './plugins/pluginManager';

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("monitoring");
  const pluginDefs = config.get<MonitoringPluginDefinition[]>("plugins") || [];

  const manager = new PluginManager();

  for (const def of pluginDefs) {
    try {
      manager.registerPlugin(def);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Plugin registration failed: ${err.message}`);
    }
  }

  const plugins = manager.getRegisteredPlugins();
  for (const plugin of plugins) {
    try {
      const alerts = await plugin.fetchAlerts();
      vscode.window.showInformationMessage(`Alerts: ${JSON.stringify(alerts)}`);
    } catch (err: any) {
      vscode.window.showErrorMessage(`Fetching alerts failed: ${err.message}`);
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand("monitoring.configurePlugin", async () => {
      const name = await vscode.window.showInputBox({ prompt: "Plugin name (e.g., prod-grafana)" });
      const type = await vscode.window.showQuickPick(["grafana", "kibana"], {
        placeHolder: "Select plugin type"
      });
      const url = await vscode.window.showInputBox({ prompt: "Monitoring API URL" });
      const apiKey = await vscode.window.showInputBox({ prompt: "API Key", password: true });
      const alertRuleId = await vscode.window.showInputBox({ prompt: "Alert Rule ID" });
      const viewUrl = await vscode.window.showInputBox({ prompt: "Dashboard View URL" });

      const extraParams: Record<string, string> = {};
      while (true) {
        const entry = await vscode.window.showInputBox({
          prompt: "Extra config (key=value), or leave blank to finish"
        });
        if (!entry) break;
        const [k, v] = entry.split("=");
        if (k && v) extraParams[k.trim()] = v.trim();
      }

      const plugin: MonitoringPluginDefinition = {
        name: name ?? "UnnamedPlugin",
        type: type ?? "custom",
        options: {
          url,
          apiKey,
          alertRuleId,
          viewUrl,
          ...extraParams
        }
      };

      const existing = config.get<MonitoringPluginDefinition[]>("plugins") || [];
      await config.update(
        "plugins",
        [...existing, plugin],
        vscode.ConfigurationTarget.Global
      );

      vscode.window.showInformationMessage(`✅ Plugin '${plugin.name}' configured!`);
    })
  );
}

export function deactivate() {}
