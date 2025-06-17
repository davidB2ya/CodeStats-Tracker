import { ActivityTracker } from "./ActivityTracker";
import { DataManager } from "./DataManager";
import { HEARTBEAT_INTERVAL } from "../utils/Constants";

export class HeartbeatManager {
  private activityTracker: ActivityTracker;
  private dataManager: DataManager;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private onDataUpdated?: (totalSeconds: number) => void;

  constructor(
    activityTracker: ActivityTracker,
    dataManager: DataManager,
    onDataUpdated?: (totalSeconds: number) => void
  ) {
    this.activityTracker = activityTracker;
    this.dataManager = dataManager;
    this.onDataUpdated = onDataUpdated;
  }

  /**
   * Inicia el ciclo de heartbeat
   */
  public start(): void {
    if (this.heartbeatInterval) {
      return; // Ya está iniciado
    }

    this.heartbeatInterval = setInterval(() => {
      this.executeHeartbeat();
    }, HEARTBEAT_INTERVAL);
  }

  /**
   * Detiene el ciclo de heartbeat
   */
  public stop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Ejecuta un ciclo de heartbeat
   */
  private async executeHeartbeat(): Promise<void> {
    try {
      const context = this.activityTracker.getCurrentContext();

      if (!context.isActive) {
        return; // Usuario inactivo
      }

      // Incrementar tiempo
      const secondsToAdd = HEARTBEAT_INTERVAL / 1000;
      const updatedStats = await this.dataManager.incrementTime(
        context.project,
        context.language,
        secondsToAdd
      );

      // Notificar actualización
      if (this.onDataUpdated) {
        this.onDataUpdated(updatedStats.totalSeconds);
      }
    } catch (error) {
      console.error("Error en heartbeat:", error);
    }
  }

  /**
   * Ejecuta un heartbeat manual
   */
  public async executeManualHeartbeat(): Promise<void> {
    await this.executeHeartbeat();
  }

  /**
   * Limpia los recursos
   */
  public dispose(): void {
    this.stop();
  }
}
