import { apiClient } from './api';
import { logError } from '../stores/logs';

export interface PingStatus {
  responseTime: number;
  status: 'good' | 'medium' | 'slow';
  color: string;
  timestamp: Date;
}

export class PingService {
  private static instance: PingService;
  private listeners: ((status: PingStatus) => void)[] = [];
  private currentStatus: PingStatus | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): PingService {
    if (!PingService.instance) {
      PingService.instance = new PingService();
    }
    return PingService.instance;
  }

  /**
   * Start monitoring API ping status
   * @param interval - Monitoring interval in milliseconds (default: 10000ms = 10s)
   */
  startMonitoring(interval: number = 10000): void {
    if (this.intervalId) {
      this.stopMonitoring();
    }

    // Initial ping
    this.performPing();

    // Set up interval
    this.intervalId = setInterval(() => {
      this.performPing();
    }, interval);
  }

  /**
   * Stop monitoring API ping status
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Subscribe to ping status updates
   */
  subscribe(callback: (status: PingStatus) => void): () => void {
    this.listeners.push(callback);

    // Send current status if available
    if (this.currentStatus) {
      callback(this.currentStatus);
    }

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get current ping status
   */
  getCurrentStatus(): PingStatus | null {
    return this.currentStatus;
  }

  /**
   * Perform a single ping test
   */
  private async performPing(): Promise<void> {
    try {
      const startTime = Date.now();
      await apiClient.ping();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const status = this.getStatusFromResponseTime(responseTime);

      this.currentStatus = {
        responseTime,
        status: status.level,
        color: status.color,
        timestamp: new Date()
      };

      // Notify all listeners
      this.listeners.forEach(callback => {
        if (this.currentStatus) {
          callback(this.currentStatus);
        }
      });
    } catch (error) {
      // Handle ping failure and log to notification stack
      logError(error instanceof Error ? error : new Error(String(error)), {
        operation: 'ping',
        endpoint: '/ping'
      });
      this.currentStatus = {
        responseTime: -1,
        status: 'slow',
        color: '#E53E3E', // Red for error
        timestamp: new Date()
      };

      this.listeners.forEach(callback => {
        if (this.currentStatus) {
          callback(this.currentStatus);
        }
      });
    }
  }

  /**
   * Determine status level and color based on response time
   */
  private getStatusFromResponseTime(responseTime: number): {
    level: 'good' | 'medium' | 'slow';
    color: string;
  } {
    if (responseTime < 150) {
      return { level: 'good', color: '#38A169' }; // Green
    } else if (responseTime <= 500) {
      return { level: 'medium', color: '#FCCF0D' }; // Yellow
    } else {
      return { level: 'slow', color: '#FF8C00' }; // Orange
    }
  }
}

// Export singleton instance
export const pingService = PingService.getInstance();
