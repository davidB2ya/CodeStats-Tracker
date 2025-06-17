export interface DailyStats {
  totalSeconds: number;
  projects: { [key: string]: number };
  languages: { [key: string]: number };
}

export interface WebviewMessage {
  command: string;
  data?: any;
}

export interface ActivityContext {
  project: string;
  language: string;
  isActive: boolean;
}
