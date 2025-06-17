// Colores para los gráficos
export const CHART_COLORS = {
  primary: "#4fc3f7",
  secondary: "#81c784",
  tertiary: "#ffb74d",
  quaternary: "#e57373",
  quinary: "#ba68c8",
  senary: "#ffd54f",
  dark: "#263238",
  gridColor: "#23272e",
  textColor: "#b0b8c1",
};

// Configuraciones por defecto para Chart.js
export const DEFAULT_CHART_OPTIONS = {
  plugins: {
    legend: { display: false },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export const GRID_CHART_OPTIONS = {
  ...DEFAULT_CHART_OPTIONS,
  scales: {
    x: {
      grid: { color: CHART_COLORS.gridColor },
      ticks: { color: CHART_COLORS.textColor },
    },
    y: {
      grid: { color: CHART_COLORS.gridColor },
      ticks: { color: CHART_COLORS.textColor },
    },
  },
};

// Constantes de tiempo
export const TIME_CONSTANTS = {
  SECONDS_IN_MINUTE: 60,
  SECONDS_IN_HOUR: 3600,
  SECONDS_IN_DAY: 86400,
};
