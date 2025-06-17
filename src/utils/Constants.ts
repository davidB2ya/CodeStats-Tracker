// Intervalo del "heartbeat" para guardar datos (en milisegundos)
export const HEARTBEAT_INTERVAL = 15000; // 15 segundos

// Umbral de inactividad (en milisegundos)
export const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutos

// Configuración del panel
export const PANEL_CONFIG = {
  viewType: "codestatsDashboard",
  title: "Panel de CodeStats",
  command: "codestats.viewDashboard",
  tooltip: "CodeStats: Click to view the dashboard",
  iconPath: "assets/favicon.png",
};

// Configuración de la barra de estado
export const STATUS_BAR_CONFIG = {
  alignment: "left",
  priority: 100,
  icon: "$(watch)",
};
