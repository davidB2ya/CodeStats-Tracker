import * as vscode from "vscode";
import { DailyStats } from "../types";
import { getTodayString, getLastNDays } from "../utils/Helpers";

export class DataManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  /**
   * Obtiene las estadísticas del día especificado
   */
  public getDailyStats(date: string): DailyStats {
    return (
      this.context.globalState.get(date) || {
        totalSeconds: 0,
        projects: {},
        languages: {},
      }
    );
  }

  /**
   * Obtiene las estadísticas de hoy
   */
  public getTodayStats(): DailyStats {
    return this.getDailyStats(getTodayString());
  }

  /**
   * Actualiza las estadísticas del día especificado
   */
  public async updateDailyStats(
    date: string,
    stats: DailyStats
  ): Promise<void> {
    await this.context.globalState.update(date, stats);
  }

  /**
   * Actualiza las estadísticas de hoy
   */
  public async updateTodayStats(stats: DailyStats): Promise<void> {
    await this.updateDailyStats(getTodayString(), stats);
  }

  /**
   * Incrementa el tiempo para un proyecto y lenguaje específicos
   */
  public async incrementTime(
    project: string,
    language: string,
    seconds: number
  ): Promise<DailyStats> {
    const today = getTodayString();
    const dailyStats = this.getDailyStats(today);

    // Actualizar estadísticas
    dailyStats.totalSeconds += seconds;
    dailyStats.projects[project] =
      (dailyStats.projects[project] || 0) + seconds;
    dailyStats.languages[language] =
      (dailyStats.languages[language] || 0) + seconds;

    await this.updateDailyStats(today, dailyStats);
    return dailyStats;
  }

  /**
   * Obtiene datos de los últimos N días
   */
  public getLastNDaysData(n: number = 7): { [key: string]: DailyStats } {
    const dates = getLastNDays(n);
    const data: { [key: string]: DailyStats } = {};

    for (const date of dates) {
      const stats = this.getDailyStats(date);
      if (stats.totalSeconds > 0) {
        data[date] = stats;
      }
    }

    return data;
  }

  /**
   * Obtiene todas las claves almacenadas
   */
  public getAllKeys(): readonly string[] {
    return this.context.globalState.keys();
  }

  /**
   * Obtiene todos los datos almacenados
   */
  public getAllData(): { [key: string]: any } {
    const allKeys = this.getAllKeys();
    const allData: { [key: string]: any } = {};

    for (const key of allKeys) {
      allData[key] = this.context.globalState.get(key);
    }

    return allData;
  }
}
