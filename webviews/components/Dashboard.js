import { DataProcessor } from "../services/DataProcessor.js";
import { ChartFactory } from "./charts/ChartFactory.js";
import { SummaryCards } from "./cards/SummaryCards.js";
import { SummaryTable } from "./tables/SummaryTable.js";
import { RankingTable } from "./tables/RankingTable.js";
import { secondsToMinutes, secondsToHours } from "../utils/timeFormatter.js";

/**
 * Clase principal del Dashboard
 */
export class Dashboard {
  constructor() {
    console.log("Dashboard constructor ejecutado");
    this.charts = new Map();
    this.summaryTable = new SummaryTable();
    this.rankingTable = new RankingTable();
  }

  /**
   * Renderiza todo el dashboard con los datos proporcionados
   * @param {Object} data - Datos de estadísticas
   */
  render(data) {
    console.log("Dashboard.render:", data);

    const processor = new DataProcessor(data);
    const stats = processor.getGeneralStats();
    const todayData = processor.getTodayData();

    // Actualizar tarjetas de resumen
    SummaryCards.updateAll(stats);

    // Renderizar gráficos
    this.renderTimeChart(processor);
    this.renderLanguageChart(todayData.languages);
    this.renderProjectChart(todayData.projects);
    this.renderTrendChart(processor);
    this.renderComparisonCharts(stats);
    this.renderActiveIdleChart(processor);
    this.renderTotalTimeChart(processor);

    // Renderizar tablas
    this.summaryTable.render(data);

    const rankingTable = processor.getProductivityRanking(7);
    this.rankingTable.render(rankingTable);
  }

  /**
   * Renderiza el gráfico de tiempo por día
   * @param {DataProcessor} processor
   */
  renderTimeChart(processor) {
    const canvas = document.getElementById("timeChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("timeChart");

    const trendData = processor.getTrendData();
    const chart = ChartFactory.createBarChart(canvas, {
      labels: trendData.labels,
      values: trendData.data.map(secondsToMinutes),
      label: "Min",
      backgroundColor: "#4fc3f7",
    });

    this.charts.set("timeChart", chart);
  }

  /**
   * Renderiza el gráfico de lenguajes del día actual
   * @param {Object} languages - Datos de lenguajes
   */
  renderLanguageChart(languages) {
    const canvas = document.getElementById("langChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("langChart");

    const labels = Object.keys(languages);
    const values = Object.values(languages);

    if (labels.length === 0) {
      return;
    }

    const chart = ChartFactory.createDoughnutChart(canvas, {
      labels,
      values,
    });

    this.charts.set("langChart", chart);
  }

  /**
   * Renderiza el gráfico de proyectos del día actual
   * @param {Object} projects - Datos de proyectos
   */
  renderProjectChart(projects) {
    const canvas = document.getElementById("projectChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("projectChart");

    const labels = Object.keys(projects);
    const values = Object.values(projects);

    if (labels.length === 0) {
      return;
    }

    const chart = ChartFactory.createDoughnutChart(canvas, {
      labels,
      values,
    });

    this.charts.set("projectChart", chart);
  }

  /**
   * Renderiza el gráfico de tendencias
   * @param {DataProcessor} processor
   */
  renderTrendChart(processor) {
    const canvas = document.getElementById("trendChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("trendChart");

    const trendData = processor.getTrendData();
    const chart = ChartFactory.createLineChart(canvas, {
      labels: trendData.labels,
      values: trendData.data.map(secondsToMinutes),
      label: "Minutos",
      tension: 0.3,
    });

    this.charts.set("trendChart", chart);
  }

  /**
   * Renderiza los gráficos de comparación (proyectos y lenguajes)
   * @param {Object} stats - Estadísticas generales
   */
  renderComparisonCharts(stats) {
    this.renderCompareProjectsChart(stats.allProjects);
    this.renderCompareLangsChart(stats.allLanguages);
  }

  /**
   * Renderiza el gráfico de comparación de proyectos
   * @param {Object} projects - Todos los proyectos
   */
  renderCompareProjectsChart(projects) {
    const canvas = document.getElementById("compareProjectsChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("compareProjectsChart");

    const labels = Object.keys(projects);
    const values = Object.values(projects).map(secondsToMinutes);

    if (labels.length === 0) {
      return;
    }

    const chart = ChartFactory.createBarChart(
      canvas,
      {
        labels,
        values,
        label: "Minutos",
        backgroundColor: "#81c784",
      },
      {
        scales: {
          x: { grid: { display: false }, ticks: { color: "#b0b8c1" } },
          y: { grid: { color: "#23272e" }, ticks: { color: "#b0b8c1" } },
        },
      }
    );

    this.charts.set("compareProjectsChart", chart);
  }

  /**
   * Renderiza el gráfico de comparación de lenguajes
   * @param {Object} languages - Todos los lenguajes
   */
  renderCompareLangsChart(languages) {
    const canvas = document.getElementById("compareLangsChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("compareLangsChart");

    const labels = Object.keys(languages);
    const values = Object.values(languages).map(secondsToMinutes);

    if (labels.length === 0) {
      return;
    }

    const chart = ChartFactory.createBarChart(canvas, {
      labels,
      values,
      label: "Minutos",
      backgroundColor: "#ba68c8",
    });

    this.charts.set("compareLangsChart", chart);
  }

  /**
   * Renderiza el gráfico de tiempo activo vs inactivo
   * @param {DataProcessor} processor
   */
  renderActiveIdleChart(processor) {
    const canvas = document.getElementById("activeVsIdleChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("activeVsIdleChart");

    const { active, idle } = processor.getActiveVsIdleTime();

    const chart = ChartFactory.createDoughnutChart(
      canvas,
      {
        labels: ["Activo", "Inactivo"],
        values: [active, idle],
        colors: ["#4fc3f7", "#263238"],
      },
      {
        cutout: "70%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { color: "#b0b8c1" },
          },
        },
      }
    );

    this.charts.set("activeVsIdleChart", chart);
  }

  /**
   * Renderiza el gráfico de tiempo total (últimos 7 días)
   * @param {DataProcessor} processor
   */
  renderTotalTimeChart(processor) {
    const canvas = document.getElementById("totalTimeChart");
    if (!canvas) {
      return;
    }

    this.destroyChart("totalTimeChart");

    const last7Days = processor.getLastDays(7);
    const data = last7Days.map((day) =>
      secondsToHours(processor.data[day]?.totalSeconds || 0)
    );

    const chart = ChartFactory.createLineChart(canvas, {
      labels: last7Days,
      values: data,
      label: "Horas",
      tension: 0.4,
      pointRadius: 4,
    });

    this.charts.set("totalTimeChart", chart);
  }

  /**
   * Destruye un gráfico específico
   * @param {string} chartId - ID del gráfico
   */
  destroyChart(chartId) {
    const existingChart = this.charts.get(chartId);
    if (existingChart) {
      ChartFactory.destroyChart(existingChart);
      this.charts.delete(chartId);
    }
  }

  /**
   * Destruye todos los gráficos
   */
  destroyAllCharts() {
    this.charts.forEach((chart, id) => {
      ChartFactory.destroyChart(chart);
    });
    this.charts.clear();
  }

  /**
   * Redimensiona todos los gráficos
   */
  resizeCharts() {
    this.charts.forEach((chart) => {
      if (chart && typeof chart.resize === "function") {
        chart.resize();
      }
    });
  }

  /**
   * Actualiza el tema de los gráficos
   * @param {string} theme - 'dark' o 'light'
   */
  updateTheme(theme) {
    // Implementar cambio de tema si es necesario
    console.log(`Cambiando tema a: ${theme}`);
  }
}
