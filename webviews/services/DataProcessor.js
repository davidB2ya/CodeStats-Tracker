/**
 * Servicio para procesar y analizar datos de estadísticas de código
 */
export class DataProcessor {
  constructor(data) {
    this.data = data;
    this.days = Object.keys(data).sort();
  }

  /**
   * Obtiene estadísticas generales
   * @returns {Object} Estadísticas procesadas
   */
  getGeneralStats() {
    let total = 0;
    let max = 0;
    let topDay = "";
    const langCount = {};
    const projCount = {};

    this.days.forEach((day) => {
      const dayData = this.data[day];
      const dayTotal = dayData.totalSeconds || 0;

      total += dayTotal;

      if (dayTotal > max) {
        max = dayTotal;
        topDay = day;
      }

      // Acumular lenguajes
      for (const lang in dayData.languages) {
        langCount[lang] = (langCount[lang] || 0) + dayData.languages[lang];
      }

      // Acumular proyectos
      for (const proj in dayData.projects) {
        projCount[proj] = (projCount[proj] || 0) + dayData.projects[proj];
      }
    });

    const average = this.days.length ? total / this.days.length : 0;
    const topLanguage = this._getTopItem(langCount);
    const topProject = this._getTopItem(projCount);

    return {
      total,
      average,
      topDay: topDay || "-",
      topLanguage,
      topProject,
      allLanguages: langCount,
      allProjects: projCount,
    };
  }

  /**
   * Obtiene datos del día actual (último día)
   * @returns {Object} Datos del día actual
   */
  getTodayData() {
    const today = this.days[this.days.length - 1];
    return this.data[today] || { languages: {}, projects: {} };
  }

  /**
   * Obtiene los últimos N días
   * @param {number} count - Número de días
   * @returns {Array} Array de días
   */
  getLastDays(count = 7) {
    return this.days.slice(-count);
  }

  /**
   * Obtiene ranking de días más productivos
   * @param {number} limit - Límite de resultados
   * @returns {Array} Array de días ordenados por productividad
   */
  getProductivityRanking(limit = 7) {
    return this.days
      .map((day) => ({
        day,
        total: this.data[day].totalSeconds || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  /**
   * Obtiene datos para gráfico de tendencias
   * @returns {Object} Labels y datos para el gráfico
   */
  getTrendData() {
    return {
      labels: this.days,
      data: this.days.map((day) => this.data[day].totalSeconds || 0),
    };
  }

  /**
   * Calcula tiempo activo vs inactivo para un día específico
   * @param {string} day - Día a analizar (opcional, por defecto hoy)
   * @returns {Object} Tiempo activo e inactivo
   */
  getActiveVsIdleTime(day = null) {
    const targetDay = day || this.days[this.days.length - 1];
    const active = this.data[targetDay]?.totalSeconds || 0;
    const idle = Math.max(0, 86400 - active); // 86400 segundos = 24 horas

    return { active, idle };
  }

  /**
   * Obtiene el elemento con mayor valor de un objeto
   * @private
   * @param {Object} obj - Objeto a procesar
   * @returns {string} Clave del elemento con mayor valor
   */
  _getTopItem(obj) {
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return "-";
    }
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }
}
