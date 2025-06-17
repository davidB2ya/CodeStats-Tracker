import { FileExporter } from "./FileExporter.js";
import { Dashboard } from "../components/Dashboard.js";

/**
 * Maneja la comunicación con VS Code
 */
export class MessageHandler {
  constructor() {
    this.vscode = null;
    this.dashboard = null;
    this.pendingMessages = [];
    this.setupEventListeners();
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    this.initialize();
    window.addEventListener("load", () => {
      // Procesa mensajes pendientes
      this.pendingMessages.forEach((msg) => this.handleMessage(msg));
      this.pendingMessages = [];
    });
    window.addEventListener("message", (event) => {
      if (this.dashboard) {
        this.handleMessage(event.data);
      } else {
        this.pendingMessages.push(event.data);
      }
    });
  }

  /**
   * Inicializa la comunicación con VS Code
   */
  initialize() {
    this.vscode = acquireVsCodeApi();
    this.dashboard = new Dashboard();
    this.requestData();
    console.log("Dashboard inicializado:", this.dashboard);
  }

  /**
   * Maneja los mensajes recibidos
   * @param {Object} message - Mensaje recibido
   */
  handleMessage(message) {
    console.log("MessageHandler.handleMessage:", message);
    switch (message.command) {
      case "updateData":
        console.log("Dashboard en handleMessage:", this.dashboard);
        if (this.dashboard) {
          this.dashboard.render(message.data);
        } else {
          // Si por alguna razón sigue sin estar, vuelve a guardar el mensaje
          this.pendingMessages.push(message);
        }
        break;
      case "downloadData":
        FileExporter.downloadAsJSON(message.data);
        break;
      default:
        console.warn("Comando no reconocido:", message.command);
    }
  }

  /**
   * Solicita datos a VS Code
   */
  requestData() {
    if (this.vscode) {
      this.vscode.postMessage({ command: "getData" });
    }
  }

  /**
   * Solicita exportación de datos
   */
  requestExport() {
    console.log("Solicitando datos a VS Code");
    if (this.vscode) {
      this.vscode.postMessage({ command: "exportData" });
    }
  }

  /**
   * Obtiene la instancia de VS Code API
   * @returns {Object} VS Code API
   */
  getVSCodeAPI() {
    return this.vscode;
  }
}
