import { TIME_CONSTANTS } from "./constants.js";

/**
 * Formatea segundos a formato legible (Xh Ym)
 * @param {number} sec - Segundos a formatear
 * @returns {string} Tiempo formateado
 */
export function formatTime(sec) {
  const seconds = Math.round(sec || 0);
  const hours = Math.floor(seconds / TIME_CONSTANTS.SECONDS_IN_HOUR);
  const minutes = Math.floor(
    (seconds % TIME_CONSTANTS.SECONDS_IN_HOUR) /
      TIME_CONSTANTS.SECONDS_IN_MINUTE
  );
  return `${hours}h ${minutes}m`;
}

/**
 * Convierte segundos a minutos redondeados
 * @param {number} seconds
 * @returns {number}
 */
export function secondsToMinutes(seconds) {
  return Math.round((seconds || 0) / TIME_CONSTANTS.SECONDS_IN_MINUTE);
}

/**
 * Convierte segundos a horas redondeadas
 * @param {number} seconds
 * @returns {number}
 */
export function secondsToHours(seconds) {
  return Math.round((seconds || 0) / TIME_CONSTANTS.SECONDS_IN_HOUR);
}
