import { formatTime } from "../../utils/timeFormatter.js";

/**
 * Maneja la tabla de resumen diario
 */
export class SummaryTable {
  constructor(tableId = "summaryTable") {
    this.tableId = tableId;
    this.table = document.getElementById(tableId);
    this.tbody = this.table?.querySelector("tbody");
  }

  /**
   * Renderiza la tabla con los datos proporcionados
   * @param {Object} data - Datos de estadísticas por día
   */
  render(data) {
    if (!this.tbody) {
      console.error(`No se encontró el tbody de la tabla ${this.tableId}`);
      return;
    }

    // Limpiar contenido existente
    this.tbody.innerHTML = "";

    // Ordenar días en orden descendente (más reciente primero)
    const sortedDays = Object.keys(data).sort().reverse();

    sortedDays.forEach((day) => {
      const dayData = data[day];
      const row = this.createRow(day, dayData);
      this.tbody.appendChild(row);
    });
  }

  /**
   * Crea una fila de la tabla
   * @param {string} day - Fecha del día
   * @param {Object} dayData - Datos del día
   * @returns {HTMLTableRowElement} Fila de la tabla
   */
  createRow(day, dayData) {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = day;

    const totalTimeCell = document.createElement("td");
    totalTimeCell.textContent = formatTime(dayData.totalSeconds);

    const projectsCell = document.createElement("td");
    projectsCell.innerHTML = this.formatObjectEntries(dayData.projects || {});

    const languagesCell = document.createElement("td");
    languagesCell.innerHTML = this.formatObjectEntries(dayData.languages || {});

    row.appendChild(dateCell);
    row.appendChild(totalTimeCell);
    row.appendChild(projectsCell);
    row.appendChild(languagesCell);

    return row;
  }

  /**
   * Formatea las entradas de un objeto (proyectos o lenguajes)
   * @param {Object} obj - Objeto a formatear
   * @returns {string} HTML formateado
   */
  formatObjectEntries(obj) {
    return Object.entries(obj)
      .map(([key, time]) => `${key}: ${formatTime(time)}`)
      .join("<br>");
  }

  /**
   * Añade filtros de búsqueda a la tabla
   * @param {string} inputId - ID del input de búsqueda
   */
  addSearchFilter(inputId) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) {
      return;
    }

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = this.tbody.querySelectorAll("tr");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
      });
    });
  }

  /**
   * Ordena la tabla por una columna específica
   * @param {number} columnIndex - Índice de la columna (0-based)
   * @param {boolean} ascending - Orden ascendente o descendente
   */
  sortByColumn(columnIndex, ascending = true) {
    const rows = Array.from(this.tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent;
      const bValue = b.cells[columnIndex].textContent;

      // Para fechas (columna 0)
      if (columnIndex === 0) {
        return ascending
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // Para texto general
      return ascending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Limpiar y volver a añadir las filas ordenadas
    this.tbody.innerHTML = "";
    rows.forEach((row) => this.tbody.appendChild(row));
  }

  /**
   * Exporta los datos de la tabla a CSV
   * @returns {string} Contenido CSV
   */
  exportToCSV() {
    const headers = ["Date", "Total Time", "Projects", "Languages"];
    const rows = Array.from(this.tbody.querySelectorAll("tr"));

    const csvRows = [headers];

    rows.forEach((row) => {
      const cells = Array.from(row.cells);
      const csvRow = cells.map(
        (cell) => `"${cell.textContent.replace(/"/g, '""')}"`
      );
      csvRows.push(csvRow);
    });

    return csvRows.map((row) => row.join(",")).join("\n");
  }
}
