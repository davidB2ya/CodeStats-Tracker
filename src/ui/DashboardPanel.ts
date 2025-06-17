import * as vscode from "vscode";
import * as path from "path";
import { DataManager } from "../core/DataManager";
import { WebviewMessage } from "../types";
import { PANEL_CONFIG } from "../utils/Constants";
import { getNonce } from "../utils/Helpers";

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _context: vscode.ExtensionContext;
  private readonly _dataManager: DataManager;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext,
    dataManager: DataManager
  ) {
    this._panel = panel;
    this._context = context;
    this._dataManager = dataManager;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._setWebviewMessageListener();
    this._panel.webview.html = this._getHtmlForWebview();
    this.sendData();
  }

  /**
   * Crea o muestra el panel del dashboard
   */
  public static createOrShow(
    context: vscode.ExtensionContext,
    dataManager: DataManager
  ): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      PANEL_CONFIG.viewType,
      PANEL_CONFIG.title,
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, "webviews")),
          vscode.Uri.file(path.join(context.extensionPath, "assets")),
        ],
      }
    );

    panel.iconPath = {
      light: vscode.Uri.file(
        path.join(context.extensionPath, PANEL_CONFIG.iconPath)
      ),
      dark: vscode.Uri.file(
        path.join(context.extensionPath, PANEL_CONFIG.iconPath)
      ),
    };

    DashboardPanel.currentPanel = new DashboardPanel(
      panel,
      context,
      dataManager
    );
  }

  /**
   * Envía datos al webview
   */
  public sendData(): void {
    const allData = this._dataManager.getLastNDaysData(7);
    console.log("Enviando datos al webview:", allData);
    this._panel.webview.postMessage({
      command: "updateData",
      data: allData,
    });
  }

  /**
   * Configura el listener de mensajes del webview
   */
  private _setWebviewMessageListener(): void {
    this._panel.webview.onDidReceiveMessage(
      async (message: WebviewMessage) => {
        console.log("Mensaje recibido en extensión:", message);
        switch (message.command) {
          case "getData":
            this.sendData();
            break;

          case "exportData":
            const allData = this._dataManager.getAllData();
            this._panel.webview.postMessage({
              command: "downloadData",
              data: allData,
            });
            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  /**
   * Limpia los recursos
   */
  public dispose(): void {
    DashboardPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Genera el HTML del webview
   */
  private _getHtmlForWebview(): string {
    const webview = this._panel.webview;

    // URIs de recursos
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        "webviews",
        "dashboard.js"
      )
    );
    const chartjsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        "webviews",
        "chart.umd.js"
      )
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "webviews", "style.css")
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Statistics Dashboard</title>
            </head>
            <body>
                <h1>CodeStats Tracker Dashboard</h1>

              <div class="summary-cards">
                <div class="card" id="avgTimeCard">
                  <span class="icon">⏱️</span>
                  <span class="text"></span>
                </div>
                <div class="card" id="topDayCard">
                  <span class="icon">📅</span>
                  <span class="text"></span>
                </div>
                <div class="card" id="topLanguageCard">
                  <span class="icon">💻</span>
                  <span class="text"></span>
                </div>
                <div class="card" id="topProjectCard">
                  <span class="icon">📁</span>
                  <span class="text"></span>
                </div>
              </div>

              <div class="container">
                  <div class="chart-container">
                      <h2>Coding Time (Last 7 Days)</h2>
                      <canvas id="timeChart"></canvas>
                  </div>

                  <div class="chart-container">
                      <h2>Language Distribution (Today)</h2>
                      <canvas id="langChart"></canvas>
                  </div>

                  <div class="chart-container">
                      <h2>Project Distribution (Today)</h2>
                      <canvas id="projectChart"></canvas>
                  </div>

                  <div class="chart-container">
                    <h2>Weekly/Monthly Trend</h2>
                    <canvas id="trendChart"></canvas>
                  </div>
                  <div class="chart-container">
                    <h2>Project Comparison</h2>
                    <canvas id="compareProjectsChart"></canvas>
                  </div>
                  <div class="chart-container">
                    <h2>Language Comparison</h2>
                    <canvas id="compareLangsChart"></canvas>
                  </div>
                  <div class="chart-container">
                    <h2>Total Coding Time (Last 7 Days)</h2>
                    <canvas id="totalTimeChart"></canvas>
                  </div>
                  <div class="chart-container">
                    <h2>Active vs. Inactive Time (Today)</h2>
                    <canvas id="activeVsIdleChart" width="320" height="320"></canvas>
                  </div>
              </div>

              <div class="table-container">
                <div class="table-title">
                  <span class="table-icon">📋</span> Detailed Daily Summary
                </div>
                <table id="summaryTable">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Time</th>
                      <th>Projects</th>
                      <th>Languages</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Rows inserted dynamically -->
                  </tbody>
                </table>
              </div>

              <div class="table-container">
                <div class="table-title">
                  <span class="table-icon">🏆</span> Most Productive Days Ranking
                </div>
                <table id="rankingTable">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Filled dynamically -->
                  </tbody>
                </table>
              </div>

              <script nonce="${nonce}" type="module" src="${chartjsUri}"></script>
              <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}
