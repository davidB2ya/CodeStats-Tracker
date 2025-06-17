import ChartFactory from "./ChartFactory.js";

/**
 * Gráfico de donut para mostrar tiempo activo vs inactivo
 */
class ActiveIdleChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  render(data, day = null) {
    const days = Object.keys(data).sort();
    const targetDay = day || days[days.length - 1];
    const activeSeconds = data[targetDay]?.totalSeconds || 0;
    const idleSeconds = 86400 - activeSeconds; // 24 horas en segundos

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "doughnut",
      data: {
        labels: ["Activo", "Inactivo"],
        datasets: [
          {
            data: [activeSeconds, idleSeconds > 0 ? idleSeconds : 0],
            backgroundColor: [ChartFactory.getColors(1), "#263238"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: "#b0b8c1",
            },
          },
        },
        cutout: "70%", // Hace el donut más delgado y moderno
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

export default ActiveIdleChart;
