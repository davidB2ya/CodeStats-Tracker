import ChartFactory from "./ChartFactory.js";

/**
 * Gráfico de donut para mostrar distribución de lenguajes
 */
class LanguageChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  render(data, day = null) {
    const days = Object.keys(data).sort();
    const targetDay = day || days[days.length - 1];
    const languages = data[targetDay]?.languages || {};

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(languages);
    const values = Object.values(languages);

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: ChartFactory.getColors(labels.length),
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
      },
    });
  }

  renderComparison(data) {
    // Agregar todos los lenguajes de todos los días
    const allLanguages = {};
    Object.keys(data).forEach((day) => {
      const languages = data[day].languages || {};
      for (const lang in languages) {
        allLanguages[lang] = (allLanguages[lang] || 0) + languages[lang];
      }
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "bar",
      data: {
        labels: Object.keys(allLanguages),
        datasets: [
          {
            label: "Minutos",
            data: Object.values(allLanguages).map((s) => Math.round(s / 60)),
            backgroundColor: "#ba68c8",
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

export default LanguageChart;
