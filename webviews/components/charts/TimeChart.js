import ChartFactory from "./ChartFactory.js";

/**
 * Gráfico de barras para mostrar tiempo por día
 */
class TimeChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  render(data) {
    const days = Object.keys(data).sort();
    const timeData = days.map((day) =>
      Math.round((data[day].totalSeconds || 0) / 60)
    );

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "bar",
      data: {
        labels: days,
        datasets: [
          {
            label: "Minutos",
            data: timeData,
            backgroundColor: ChartFactory.getColors(1),
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

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

export default TimeChart;
