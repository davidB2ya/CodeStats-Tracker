import ChartFactory from "./ChartFactory.js";

/**
 * Gráfico de línea para mostrar tendencias temporales
 */
class TrendChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  render(data) {
    const days = Object.keys(data).sort();
    const trendData = days.map((day) =>
      Math.round((data[day].totalSeconds || 0) / 60)
    );

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "line",
      data: {
        labels: days,
        datasets: [
          {
            label: "Minutos",
            data: trendData,
            borderColor: ChartFactory.getColors(1),
            backgroundColor: "rgba(79,195,247,0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  renderLast7Days(data) {
    const days = Object.keys(data).sort();
    const last7Days = days.slice(-7);
    const totalTimeData = last7Days.map((day) =>
      Math.round((data[day]?.totalSeconds || 0) / 3600)
    );

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "line",
      data: {
        labels: last7Days,
        datasets: [
          {
            label: "Horas",
            data: totalTimeData,
            borderColor: ChartFactory.getColors(1),
            backgroundColor: "rgba(79,195,247,0.1)",
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: ChartFactory.getColors(1),
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: "#23272e" },
            ticks: { color: "#b0b8c1" },
          },
          y: {
            grid: { color: "#23272e" },
            ticks: { color: "#b0b8c1" },
          },
        },
      },
    });
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

export default TrendChart;
