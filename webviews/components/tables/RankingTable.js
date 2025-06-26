import { formatTime } from "../../utils/timeFormatter.js";

/**
 * Maneja la tabla de ranking de días productivos
 */
export class RankingTable {
  constructor(tableId = "rankingTable") {
    this.tableId = tableId;
    this.table = document.getElementById(tableId);
    this.tbody = this.table?.querySelector("tbody");
  }

  /**
   * Renderiza la tabla de ranking
   * @param {Array} rankingData - Array de objetos con day y total
   */
  render(rankingData) {
    if (!this.tbody) {
      console.error(`No se encontró el tbody de la tabla ${this.tableId}`);
      return;
    }

    // Limpiar contenido existente
    this.tbody.innerHTML = "";

    rankingData.forEach((item, index) => {
      const row = this.createRankingRow(item, index + 1, rankingData.length);
      this.tbody.appendChild(row);
    });

    // Añadir tooltips después de renderizar
    this.addTooltips();
  }

  /**
   * Crea una fila del ranking
   * @param {Object} item - Objeto con day y total
   * @param {number} position - Posición en el ranking
   * @param {number} totalItems - Total de ítems en el ranking
   * @returns {HTMLTableRowElement} Fila de la tabla
   */
  createRankingRow(item, position, totalItems) {
    const row = document.createElement("tr");

    console.log("Position Item =>", position, item)
    // Añadir clase especial para los primeros 3 puestos
    if (position <= 3 && totalItems >= 3) {
      row.classList.add(`rank-${position}`);
    }

    const positionCell = document.createElement("td");
    positionCell.classList.add("position-cell");

    // Medallas para los primeros 3 puestos
    const medals = {
      1: "🥇",
      2: "🥈",
      3: "🥉",
    };
    const icon = medals[position] || "#️⃣";
    if (position <= 3 && totalItems >= 3) {
      positionCell.innerHTML = `<span class="medal">${icon}</span> #${position}`;
    } else {
      positionCell.innerHTML = `<span class="medal">${icon}</span> #${position}`;
    }

    const dateCell = document.createElement("td");
    dateCell.textContent = item.day;

    const totalTimeCell = document.createElement("td");
    totalTimeCell.textContent = formatTime(item.total);
    totalTimeCell.classList.add("time-cell");

    row.appendChild(positionCell);
    row.appendChild(dateCell);
    row.appendChild(totalTimeCell);

    return row;
  }

  /**
   * Actualiza el ranking con animación
   * @param {Array} newRankingData
   */
  updateWithAnimation(newRankingData) {
    if (!this.tbody) {
      return;
    }

    // Fade out
    this.tbody.style.opacity = "0.5";
    this.tbody.style.transition = "opacity 0.3s ease";

    setTimeout(() => {
      this.render(newRankingData);

      // Fade in
      this.tbody.style.opacity = "1";
    }, 300);
  }

  /**
   * Obtiene estadísticas del ranking
   * @param {Array} rankingData
   * @returns {Object} Estadísticas del ranking
   */
  getRankingStats(rankingData) {
    if (!rankingData || rankingData.length === 0) {
      return { average: 0, total: 0, best: 0, worst: 0 };
    }

    const times = rankingData.map((item) => item.total);
    const total = times.reduce((sum, time) => sum + time, 0);
    const average = total / times.length;
    const best = Math.max(...times);
    const worst = Math.min(...times);

    return { average, total, best, worst };
  }

  /**
   * Exporta el ranking a CSV
   * @param {Array} rankingData
   * @returns {string} Contenido CSV
   */
  exportToCSV(rankingData) {
    const headers = ["Position", "Date", "Total Time (minutes)"];
    const rows = [headers];

    rankingData.forEach((item, index) => {
      const minutes = Math.round(item.total / 60);
      rows.push([`#${index + 1}`, item.day, minutes.toString()]);
    });

    return rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  /**
   * Filtra el ranking por rango de fechas
   * @param {Array} rankingData
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Array} Ranking filtrado
   */
  filterByDateRange(rankingData, startDate, endDate) {
    return rankingData.filter((item) => {
      const itemDate = new Date(item.day);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  /**
   * Añade tooltips a las filas del ranking
   */
  addTooltips() {
    const rows = this.tbody?.querySelectorAll("tr");
    if (!rows) {
      return;
    }

    rows.forEach((row, index) => {
      const position = index + 1;
      let tooltipText = "";

      switch (position) {
        case 1:
          tooltipText = "¡Tu día más productivo! 🎉";
          break;
        case 2:
          tooltipText = "Segundo lugar - ¡Muy bien! 💪";
          break;
        case 3:
          tooltipText = "Tercer lugar - ¡Buen trabajo! 👏";
          break;
        default:
          tooltipText = `Posición ${position} en productividad`;
      }

      row.title = tooltipText;
    });
  }
}
