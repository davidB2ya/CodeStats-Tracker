import * as vscode from "vscode";

// Intervalo del "heartbeat" para guardar datos (en milisegundos)
const HEARTBEAT_INTERVAL = 15000; // 15 segundos
// Umbral de inactividad (en milisegundos)
const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutos

let lastActivityTimestamp = Date.now();
let statusBarItem: vscode.StatusBarItem;
let heartbeatInterval: NodeJS.Timeout;

// El punto de entrada principal de la extensión
export function activate(context: vscode.ExtensionContext) {
  console.log("CodeStats Tracker está activo.");

  // Crear y configurar el ítem de la barra de estado
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = "codestats.viewDashboard";
  statusBarItem.tooltip = "CodeStats: Haz clic para ver el panel";
  context.subscriptions.push(statusBarItem);
  updateStatusBar(context);
  statusBarItem.show();

  // Registrar el comando para abrir el panel webview
  context.subscriptions.push(
    vscode.commands.registerCommand("codestats.viewDashboard", () => {
      DashboardPanel.createOrShow(context);
    })
  );

  // Listeners para detectar actividad del usuario
  const activityListeners = [
    vscode.window.onDidChangeActiveTextEditor(trackActivity),
    vscode.workspace.onDidChangeTextDocument(trackActivity),
    vscode.window.onDidChangeTextEditorSelection(trackActivity),
    vscode.window.onDidChangeWindowState(trackActivity),
  ];
  context.subscriptions.push(...activityListeners);

  // Iniciar el ciclo de "heartbeat" para guardar datos periódicamente
  heartbeatInterval = setInterval(() => heartbeat(context), HEARTBEAT_INTERVAL);
  context.subscriptions.push({
    dispose: () => clearInterval(heartbeatInterval),
  });

  trackActivity();
}

// Función que se ejecuta en cada "heartbeat"
async function heartbeat(context: vscode.ExtensionContext) {
  const now = Date.now();
  if (now - lastActivityTimestamp > IDLE_THRESHOLD) {
    // El usuario está inactivo, no registrar tiempo
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor || !vscode.window.state.focused) {
    // No hay editor activo o la ventana no está enfocada
    return;
  }

  // Obtener contexto actual
  const project = vscode.workspace.name || "Sin Proyecto";
  const language = editor.document.languageId || "desconocido";

  // Obtener datos almacenados
  const today = new Date().toISOString().slice(0, 10);
  let dailyStats: any = context.globalState.get(today) || {
    totalSeconds: 0,
    projects: {},
    languages: {},
  };

  // Actualizar estadísticas
  dailyStats.totalSeconds =
    (dailyStats.totalSeconds || 0) + HEARTBEAT_INTERVAL / 1000;

  // Proyectos
  dailyStats.projects[project] =
    (dailyStats.projects[project] || 0) + HEARTBEAT_INTERVAL / 1000;

  // Lenguajes
  dailyStats.languages[language] =
    (dailyStats.languages[language] || 0) + HEARTBEAT_INTERVAL / 1000;

  // Guardar datos
  await context.globalState.update(today, dailyStats);

  // Actualizar UI
  updateStatusBar(context, dailyStats.totalSeconds);

  // Notificar al panel si está abierto
  if (DashboardPanel.currentPanel) {
    DashboardPanel.currentPanel.sendData();
  }
}

// Función para registrar la última actividad del usuario
function trackActivity() {
  lastActivityTimestamp = Date.now();
}

// Función para actualizar el texto de la barra de estado
async function updateStatusBar(
  context: vscode.ExtensionContext,
  totalSeconds?: number
) {
  if (totalSeconds === undefined) {
    const today = new Date().toISOString().slice(0, 10);
    const dailyStats: any = context.globalState.get(today) || {
      totalSeconds: 0,
    };
    totalSeconds = dailyStats.totalSeconds;
  }

  totalSeconds = totalSeconds ?? 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  statusBarItem.text = `$(watch) Hoy: ${hours}h ${minutes}m`;
}

// Clase para manejar el panel webview del dashboard
class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _context: vscode.ExtensionContext;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    context: vscode.ExtensionContext
  ) {
    this._panel = panel;
    this._context = context;
    this._disposables = [];

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._setWebviewMessageListener();

    this._panel.webview.html = this._getHtmlForWebview();
  }

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "codestatsDashboard",
      "Panel de CodeStats",
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "webviews"),
        ],
      }
    );

    DashboardPanel.currentPanel = new DashboardPanel(panel, context);
  }

  public sendData() {
    // Obtener datos de los últimos 7 días
    const allData: { [key: string]: any } = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      const data = this._context.globalState.get(dateString);
      if (data) {
        allData[dateString] = data;
      }
    }
    this._panel.webview.postMessage({ command: "updateData", data: allData });
  }

  private _setWebviewMessageListener() {
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "getData") {
          this.sendData();
        }
        if (message.command === "exportData") {
          // Recopila todos los datos guardados
          const allKeys = this._context.globalState.keys();
          const allData: any = {};
          for (const key of allKeys) {
            allData[key] = this._context.globalState.get(key);
          }
          this._panel.webview.postMessage({
            command: "downloadData",
            data: allData,
          });
        }
      },
      undefined,
      this._disposables
    );
  }

  public dispose() {
    DashboardPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(): string {
    const webview = this._panel.webview;

    // Rutas a los recursos del webview
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

    // Nonce para seguridad
    const nonce = getNonce();

    return `<!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}';">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Panel de CodeStats</title>
            </head>
            <body>
                <h1>Panel de Estadísticas</h1>
                
                <div class="summary-cards" style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:24px;">
                  <div class="card" id="avgTimeCard"></div>
                  <div class="card" id="topDayCard"></div>
                  <div class="card" id="topLangCard"></div>
                  <div class="card" id="topProjectCard"></div>
                </div>

                <div class="container">
                    <div class="chart-container">
                        <h2>Tiempo de Codificación (Últimos 7 días)</h2>
                        <canvas id="timeChart"></canvas>
                    </div>

                    <div class="chart-container">
                        <h2>Distribución por Lenguaje (Hoy)</h2>
                        <canvas id="langChart"></canvas>
                    </div>

                    <div class="chart-container">
                        <h2>Distribución por Proyecto (Hoy)</h2>
                        <canvas id="projectChart"></canvas>
                    </div>
                </div>

                <div class="table-container">
                    <h2>Resumen Diario Detallado</h2>
                    <table id="summaryTable">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tiempo Total</th>
                                <th>Proyectos</th>
                                <th>Lenguajes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Las filas se insertarán dinámicamente -->
                        </tbody>
                    </table>
                </div>

                <!-- Botón de exportar -->
                <button id="exportBtn" style="margin:16px 0 24px 0;float:right;background:#4fc3f7;color:#23272e;border:none;padding:10px 22px;border-radius:6px;font-weight:bold;cursor:pointer;">
                  Exportar datos (.json)
                </button>

                <script nonce="${nonce}" src="${chartjsUri}"></script>
                <script nonce="${nonce}" src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
}
