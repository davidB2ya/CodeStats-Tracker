import { formatTime } from "../../utils/timeFormatter.js";

/**
 * Maneja las tarjetas de resumen del dashboard
 */
export class SummaryCards {
  /**
   * Actualiza todas las tarjetas de resumen
   * @param {Object} stats - Estadísticas generales
   */
  static updateAll(stats) {
    this.updateAverageTimeCard(stats.average);
    this.updateTopDayCard(stats.topDay);
    this.updateTopLanguageCard(stats.topLanguage);
    this.updateTopProjectCard(stats.topProject);
  }

  /**
   * Actualiza la tarjeta de tiempo promedio diario
   * @param {number} averageTime - Tiempo promedio en segundos
   */
  static updateAverageTimeCard(averageTime) {
    const element = document.querySelector("#avgTimeCard .text");
    if (element) {
      element.innerHTML = `<b>Average Daily</b><br>${formatTime(averageTime)}`;
    }
  }

  /**
   * Actualiza la tarjeta del día más productivo
   * @param {string} topDay - Día más productivo
   */
  static updateTopDayCard(topDay) {
    const element = document.querySelector("#topDayCard .text");
    if (element) {
      element.innerHTML = `<b>Most Productive Day</b><br>${topDay}`;
    }
  }

  /**
   * Actualiza la tarjeta del lenguaje principal
   * @param {string} topLanguage - Lenguaje más usado
   */
  static updateTopLanguageCard(topLanguage) {
    const element = document.querySelector("#topLanguageCard .text");
    if (element) {
      element.innerHTML = `<b>Top Language</b><br>${topLanguage}`;
    }
  }

  /**
   * Actualiza la tarjeta del proyecto principal
   * @param {string} topProject - Proyecto más trabajado
   */
  static updateTopProjectCard(topProject) {
    const element = document.querySelector("#topProjectCard .text");
    if (element) {
      element.innerHTML = `<b>Top Project</b><br>${topProject}`;
    }
  }

  /**
   * Crea una nueva tarjeta de resumen
   * @param {string} id - ID del elemento
   * @param {string} title - Título de la tarjeta
   * @param {string} value - Valor a mostrar
   * @returns {HTMLElement} Elemento de la tarjeta
   */
  static createCard(id, title, value) {
    const card = document.createElement("div");
    card.id = id;
    card.className = "summary-card";

    card.innerHTML = `
      <div class="text">
        <b>${title}</b><br>${value}
      </div>
    `;

    return card;
  }

  /**
   * Valida que todos los elementos de las tarjetas existan
   * @returns {boolean} True si todos los elementos existen
   */
  static validateElements() {
    const requiredElements = [
      "#avgTimeCard .text",
      "#topDayCard .text",
      "#topLanguageCard .text",
      "#topProjectCard .text",
    ];

    return requiredElements.every((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        console.warn(`Elemento no encontrado: ${selector}`);
        return false;
      }
      return true;
    });
  }
}
