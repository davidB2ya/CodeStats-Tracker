import ChartFactory from "./ChartFactory.js";

/**
 * Gráfico de donut para mostrar distribución de proyectos
 */
class ProjectChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  render(data, day = null) {
    const days = Object.keys(data).sort();
    const targetDay = day || days[days.length - 1];
    const projects = data[targetDay]?.projects || {};

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(projects);
    const values = Object.values(projects);

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
    // Agregar todos los proyectos de todos los días
    const allProjects = {};
    Object.keys(data).forEach((day) => {
      const projects = data[day].projects || {};
      for (const project in projects) {
        allProjects[project] = (allProjects[project] || 0) + projects[project];
      }
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = ChartFactory.createChart(this.canvas, {
      type: "bar",
      data: {
        labels: Object.keys(allProjects),
        datasets: [
          {
            label: "Minutos",
            data: Object.values(allProjects).map((s) => Math.round(s / 60)),
            backgroundColor: "#81c784",
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
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

export default ProjectChart;
