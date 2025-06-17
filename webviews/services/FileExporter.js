/**
 * Servicio para exportar datos a archivos
 */
export class FileExporter {
  /**
   * Descarga datos como archivo JSON
   * @param {Object} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  static downloadAsJSON(data, filename = "codestats-data.json") {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Convierte datos a CSV
   * @param {Object} data - Datos de estadísticas
   * @returns {string} Contenido CSV
   */
  static toCSV(data) {
    const headers = ["Date", "Total Time (minutes)", "Languages", "Projects"];
    const rows = [];

    Object.keys(data)
      .sort()
      .forEach((day) => {
        const dayData = data[day];
        const totalMinutes = Math.round((dayData.totalSeconds || 0) / 60);

        const languages = Object.entries(dayData.languages || {})
          .map(([lang, time]) => `${lang}:${Math.round(time / 60)}m`)
          .join(";");

        const projects = Object.entries(dayData.projects || {})
          .map(([proj, time]) => `${proj}:${Math.round(time / 60)}m`)
          .join(";");

        rows.push([day, totalMinutes, languages, projects]);
      });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  }

  /**
   * Descarga datos como archivo CSV
   * @param {Object} data - Datos a exportar
   * @param {string} filename - Nombre del archivo
   */
  static downloadAsCSV(data, filename = "codestats-data.csv") {
    const csvContent = this.toCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
