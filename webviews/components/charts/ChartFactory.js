import {
  CHART_COLORS,
  DEFAULT_CHART_OPTIONS,
  GRID_CHART_OPTIONS,
} from "../../utils/constants.js";

/**
 * Factory para crear diferentes tipos de gráficos
 */
export class ChartFactory {
  /**
   * Crea un gráfico de barras
   * @param {HTMLCanvasElement} canvas
   * @param {Object} data
   * @param {Object} options
   * @returns {Chart}
   */
  static createBarChart(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d");
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.label || "Datos",
            data: data.values,
            backgroundColor: data.backgroundColor || CHART_COLORS.primary,
            ...data.datasetOptions,
          },
        ],
      },
      options: { ...DEFAULT_CHART_OPTIONS, ...options },
    });
  }

  /**
   * Crea un gráfico de dona
   * @param {HTMLCanvasElement} canvas
   * @param {Object} data
   * @param {Object} options
   * @returns {Chart}
   */
  static createDoughnutChart(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d");
    return new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: data.colors || [
              CHART_COLORS.primary,
              CHART_COLORS.secondary,
              CHART_COLORS.tertiary,
              CHART_COLORS.quaternary,
              CHART_COLORS.quinary,
              CHART_COLORS.senary,
            ],
          },
        ],
      },
      options: {
        ...DEFAULT_CHART_OPTIONS,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { color: CHART_COLORS.textColor },
          },
        },
        ...options,
      },
    });
  }

  /**
   * Crea un gráfico de línea
   * @param {HTMLCanvasElement} canvas
   * @param {Object} data
   * @param {Object} options
   * @returns {Chart}
   */
  static createLineChart(canvas, data, options = {}) {
    const ctx = canvas.getContext("2d");
    return new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: data.label || "Datos",
            data: data.values,
            borderColor: data.borderColor || CHART_COLORS.primary,
            backgroundColor:
              data.backgroundColor || `${CHART_COLORS.primary}20`,
            fill: data.fill !== undefined ? data.fill : true,
            tension: data.tension || 0.3,
            pointRadius: data.pointRadius || 3,
            pointBackgroundColor: data.pointColor || CHART_COLORS.primary,
            ...data.datasetOptions,
          },
        ],
      },
      options: { ...GRID_CHART_OPTIONS, ...options },
    });
  }

  /**
   * Destruye un gráfico si existe
   * @param {Chart} chart
   */
  static destroyChart(chart) {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy();
    }
  }

  /**
   * Obtiene colores predeterminados para gráficos múltiples
   * @param {number} count - Número de colores necesarios
   * @returns {Array} Array de colores
   */
  static getDefaultColors(count) {
    const colors = [
      CHART_COLORS.primary,
      CHART_COLORS.secondary,
      CHART_COLORS.tertiary,
      CHART_COLORS.quaternary,
      CHART_COLORS.quinary,
      CHART_COLORS.senary,
    ];

    // Si necesitamos más colores, generamos algunos adicionales
    while (colors.length < count) {
      const hue = (colors.length * 60) % 360;
      colors.push(`hsl(${hue}, 60%, 60%)`);
    }

    return colors.slice(0, count);
  }
}
