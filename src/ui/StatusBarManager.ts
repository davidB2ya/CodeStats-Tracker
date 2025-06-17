import * as vscode from "vscode";
import { DataManager } from "../core/DataManager";
import { STATUS_BAR_CONFIG, PANEL_CONFIG } from "../utils/Constants";
import { formatTime } from "../utils/Helpers";

export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private dataManager: DataManager;

  constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      STATUS_BAR_CONFIG.priority
    );

    this.setupStatusBar();
  }

  /**
   * Configura la barra de estado
   */
  private setupStatusBar(): void {
    this.statusBarItem.command = PANEL_CONFIG.command;
    this.statusBarItem.tooltip = PANEL_CONFIG.tooltip;
    this.updateStatusBar();
    this.statusBarItem.show();
  }

  /**
   * Actualiza el texto de la barra de estado
   */
  public updateStatusBar(totalSeconds?: number): void {
    if (totalSeconds === undefined) {
      const todayStats = this.dataManager.getTodayStats();
      totalSeconds = todayStats.totalSeconds;
    }

    const timeText = formatTime(totalSeconds);
    this.statusBarItem.text = `${STATUS_BAR_CONFIG.icon} Today: ${timeText}`;
  }

  /**
   * Muestra la barra de estado
   */
  public show(): void {
    this.statusBarItem.show();
  }

  /**
   * Oculta la barra de estado
   */
  public hide(): void {
    this.statusBarItem.hide();
  }

  /**
   * Obtiene el item de la barra de estado para suscripciones
   */
  public getStatusBarItem(): vscode.StatusBarItem {
    return this.statusBarItem;
  }

  /**
   * Limpia los recursos
   */
  public dispose(): void {
    this.statusBarItem.dispose();
  }
}
