import * as vscode from "vscode";

// Core modules
import { ActivityTracker } from "./core/ActivityTracker";
import { HeartbeatManager } from "./core/HeartbeatManager";
import { DataManager } from "./core/DataManager";

// UI modules
import { StatusBarManager } from "./ui/StatusBarManager";
import { DashboardPanel } from "./ui/DashboardPanel";

// Constants
import { PANEL_CONFIG } from "./utils/Constants";

// Variables globales de la extensión
let activityTracker: ActivityTracker;
let dataManager: DataManager;
let statusBarManager: StatusBarManager;
let heartbeatManager: HeartbeatManager;

/**
 * Punto de entrada principal de la extensión
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("CodeStats Tracker está activo.");

  try {
    // Inicializar módulos principales
    initializeModules(context);

    // Registrar comandos
    registerCommands(context);

    // Configurar suscripciones para limpieza automática
    setupSubscriptions(context);

    // Iniciar seguimiento
    startTracking();

    console.log("CodeStats Tracker inicializado correctamente.");
  } catch (error) {
    console.error("Error al inicializar CodeStats Tracker:", error);
    vscode.window.showErrorMessage("Error al inicializar CodeStats Tracker");
  }
}

/**
 * Inicializa todos los módulos principales
 */
function initializeModules(context: vscode.ExtensionContext): void {
  // Inicializar gestor de datos
  dataManager = new DataManager(context);

  // Inicializar rastreador de actividad
  activityTracker = new ActivityTracker();

  // Inicializar gestor de barra de estado
  statusBarManager = new StatusBarManager(dataManager);

  // Inicializar gestor de heartbeat con callback para actualizar UI
  heartbeatManager = new HeartbeatManager(
    activityTracker,
    dataManager,
    (totalSeconds: number) => {
      // Callback cuando se actualizan los datos
      statusBarManager.updateStatusBar(totalSeconds);

      // Notificar al panel si está abierto
      if (DashboardPanel.currentPanel) {
        DashboardPanel.currentPanel.sendData();
      }
    }
  );
}

/**
 * Registra todos los comandos de la extensión
 */
function registerCommands(context: vscode.ExtensionContext): void {
  // Comando para abrir el dashboard
  const dashboardCommand = vscode.commands.registerCommand(
    PANEL_CONFIG.command,
    () => {
      DashboardPanel.createOrShow(context, dataManager);
    }
  );

  context.subscriptions.push(dashboardCommand);
}

/**
 * Configura las suscripciones para limpieza automática
 */
function setupSubscriptions(context: vscode.ExtensionContext): void {
  // Suscribir la barra de estado para limpieza automática
  context.subscriptions.push(statusBarManager.getStatusBarItem());

  // Suscribir disposables personalizados
  context.subscriptions.push(
    { dispose: () => activityTracker.dispose() },
    { dispose: () => heartbeatManager.dispose() },
    { dispose: () => statusBarManager.dispose() }
  );
}

/**
 * Inicia el seguimiento de actividad
 */
function startTracking(): void {
  // Registrar actividad inicial
  activityTracker.trackActivity();

  // Iniciar el ciclo de heartbeat
  heartbeatManager.start();
}

/**
 * Función que se ejecuta al desactivar la extensión
 */
export function deactivate(): void {
  console.log("Desactivando CodeStats Tracker...");

  try {
    // Limpiar recursos
    if (heartbeatManager) {
      heartbeatManager.dispose();
    }

    if (activityTracker) {
      activityTracker.dispose();
    }

    if (statusBarManager) {
      statusBarManager.dispose();
    }

    console.log("CodeStats Tracker desactivado correctamente.");
  } catch (error) {
    console.error("Error al desactivar CodeStats Tracker:", error);
  }
}
