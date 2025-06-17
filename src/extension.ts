import * as vscode from 'vscode';
import PluginManager from './pluginManager';

export function activate(context: vscode.ExtensionContext) {
  const pluginManager = new PluginManager(context.extensionPath);

  const disposable = vscode.commands.registerCommand('extension.activateMonitoring', async () => {
    const plugins = pluginManager.listPlugins();

    const selected = await vscode.window.showQuickPick(plugins, { placeHolder: "Select a plugin" });
    if (!selected) return;

    const plugin = pluginManager.getPlugin(selected);
    const alerts = await plugin?.getAlerts();
    const status = await plugin?.getStatus();

    vscode.window.showInformationMessage(`Status: ${status?.status}`);
    vscode.window.showInformationMessage(`Alerts: ${JSON.stringify(alerts)}`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
