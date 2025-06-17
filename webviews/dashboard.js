/**
 * Archivo principal del dashboard refactorizado
 * Este archivo mantiene la compatibilidad con el código existente
 * pero utiliza la nueva arquitectura modular
 */

import { MessageHandler } from "./services/MessageHandler.js";
import { FileExporter } from "./services/FileExporter.js";

window.messageHandler = null;

// Cola para mensajes que lleguen antes de la inicialización
window._pendingMessages = [];

// Listener global para mensajes desde VS Code
window.addEventListener("message", (event) => {
  console.log("Mensaje recibido en dashboard.js:", event.data);
  // MOSTRAR DATOS EN PANTALLA
  const debugDiv = document.getElementById("debugData");
  if (debugDiv) {
    debugDiv.textContent = JSON.stringify(event.data, null, 2);
  }
  if (window.messageHandler && window.messageHandler.handleMessage) {
    window.messageHandler.handleMessage(event.data);
  } else {
    window._pendingMessages = window._pendingMessages || [];
    window._pendingMessages.push(event.data);
  }
});

function initializeDashboard() {
  console.log("Inicializando dashboard...");
  window.messageHandler = new MessageHandler();
  // Procesa mensajes pendientes
  if (window._pendingMessages && window._pendingMessages.length > 0) {
    window._pendingMessages.forEach((msg) =>
      window.messageHandler.handleMessage(msg)
    );
    window._pendingMessages = [];
  }
  setupExportButton();
  setupWindowResize();
}

window.addEventListener("load", initializeDashboard);

console.log("dashboard.js cargado");

/**
 * Inicialización del dashboard
 */
// function initializeDashboard() {
//   messageHandler = new MessageHandler();

//   // Procesa mensajes pendientes si los hay
//   if (window._pendingMessages && messageHandler) {
//     window._pendingMessages.forEach((msg) => messageHandler.handleMessage(msg));
//     window._pendingMessages = [];
//   }

//   vscode = messageHandler.getVSCodeAPI();

//   // Configurar el botón de exportación
//   // setupExportButton();

//   // Configurar redimensionamiento de ventana
//   setupWindowResize();
// }

/**
 * Configura el botón de exportación
 */
function setupExportButton() {
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      if (messageHandler) {
        messageHandler.requestExport();
      }
    });
  }
}

/**
 * Configura el redimensionamiento de ventana
 */
function setupWindowResize() {
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (messageHandler && messageHandler.dashboard) {
        messageHandler.dashboard.resizeCharts();
      }
    }, 100);
  });
}

/**
 * Función legacy para mantener compatibilidad
 * @deprecated Usar MessageHandler en su lugar
 */
window.renderDashboard = function (data) {
  console.warn(
    "renderDashboard es una función legacy. Usar MessageHandler en su lugar."
  );
  if (messageHandler && messageHandler.dashboard) {
    messageHandler.dashboard.render(data);
  }
};

/**
 * Función legacy para formatear tiempo
 * @deprecated Usar timeFormatter.js en su lugar
 */
window.formatTime = function (sec) {
  console.warn(
    "formatTime es una función legacy. Usar timeFormatter.js en su lugar."
  );
  const seconds = Math.round(sec || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Mantener compatibilidad con el código existente de la barra de estado
window.updateStatusBar = function (hours, minutes) {
  // Esta función será llamada desde la extensión
  if (typeof vscode !== "undefined" && vscode.postMessage) {
    vscode.postMessage({
      command: "updateStatusBar",
      data: { hours, minutes },
    });
  }
};

// Event listeners para mantener compatibilidad
window.addEventListener("load", initializeDashboard);
