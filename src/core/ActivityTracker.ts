import * as vscode from "vscode";
import { ActivityContext } from "../types";
import { IDLE_THRESHOLD } from "../utils/Constants";

export class ActivityTracker {
  private lastActivityTimestamp: number = Date.now();
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.setupActivityListeners();
  }

  /**
   * Configura los listeners para detectar actividad del usuario
   */
  private setupActivityListeners(): void {
    const listeners = [
      vscode.window.onDidChangeActiveTextEditor(() => this.trackActivity()),
      vscode.workspace.onDidChangeTextDocument(() => this.trackActivity()),
      vscode.window.onDidChangeTextEditorSelection(() => this.trackActivity()),
      vscode.window.onDidChangeWindowState(() => this.trackActivity()),
    ];

    this.disposables.push(...listeners);
  }

  /**
   * Registra la actividad del usuario
   */
  public trackActivity(): void {
    this.lastActivityTimestamp = Date.now();
  }

  /**
   * Verifica si el usuario está activo
   */
  public isUserActive(): boolean {
    const now = Date.now();
    return now - this.lastActivityTimestamp <= IDLE_THRESHOLD;
  }

  /**
   * Obtiene el contexto actual de actividad
   */
  public getCurrentContext(): ActivityContext {
    const editor = vscode.window.activeTextEditor;

    if (!editor || !vscode.window.state.focused || !this.isUserActive()) {
      return {
        project: "",
        language: "",
        isActive: false,
      };
    }

    return {
      project: vscode.workspace.name || "Sin Proyecto",
      language: editor.document.languageId || "desconocido",
      isActive: true,
    };
  }

  /**
   * Obtiene el tiempo transcurrido desde la última actividad
   */
  public getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivityTimestamp;
  }

  /**
   * Limpia los recursos
   */
  public dispose(): void {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];
  }
}
