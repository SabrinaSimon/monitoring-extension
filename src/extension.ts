import * as vscode from 'vscode';
import PluginManager from './pluginManager';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const basePath = context.extensionPath;
  const pluginManager = new PluginManager(basePath);

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.activateMonitoring', async () => {
      const plugins = pluginManager.listPlugins();
      const selected = await vscode.window.showQuickPick(plugins, { placeHolder: "Select a plugin" });
      if (!selected) return;

      const plugin = pluginManager.getPlugin(selected);
      const alerts = await plugin?.getAlerts();
      const status = await plugin?.getStatus();

      vscode.window.showInformationMessage(`Status: ${status?.status}`);
      vscode.window.showInformationMessage(`Alerts: ${JSON.stringify(alerts)}`);
    }),

    vscode.commands.registerCommand('extension.registerPlugin', async () => {
      const name = await vscode.window.showInputBox({ prompt: "Plugin Name (e.g., grafana)" });
      const pluginPath = await vscode.window.showInputBox({ prompt: "Relative path to plugin class (e.g., ./plugins/grafana/grafanaPlugin)" });
      const url = await vscode.window.showInputBox({ prompt: "Alert API URL" });
      const token = await vscode.window.showInputBox({ prompt: "API Token (optional)" });

      if (!name || !pluginPath || !url) {
        vscode.window.showErrorMessage("Incomplete input.");
        return;
      }

      const configPath = path.join(basePath, 'plugin-config.json');
      let config: any[] = [];
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      } catch {
        vscode.window.showErrorMessage("Failed to read plugin config.");
        return;
      }

      const newEntry = {
        name,
        path: pluginPath,
        options: {
          url,
          token
        }
      };

      config.push(newEntry);

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      vscode.window.showInformationMessage(`Plugin "${name}" registered. Please reload window.`);
    })
  );
}
