interface ErrorMetrics {
  count: number;
  lastOccurred: Date;
  type: string;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: Date;
  details?: string;
}

class ApplicationMonitor {
  private static instance: ApplicationMonitor;
  private errorCounts: Map<string, ErrorMetrics> = new Map();
  private healthChecks: Map<string, HealthCheck> = new Map();
  private isEnabled: boolean = true;

  static getInstance(): ApplicationMonitor {
    if (!ApplicationMonitor.instance) {
      ApplicationMonitor.instance = new ApplicationMonitor();
    }
    return ApplicationMonitor.instance;
  }

  recordError(error: Error | string, context?: any): void {
    if (!this.isEnabled) return;

    const errorKey = typeof error === 'string' ? error : error.name || 'UnknownError';
    const errorMessage = typeof error === 'string' ? error : error.message;

    const existing = this.errorCounts.get(errorKey);
    this.errorCounts.set(errorKey, {
      count: existing ? existing.count + 1 : 1,
      lastOccurred: new Date(),
      type: errorKey,
    });

    console.error('Error recorded by monitor:', {
      type: errorKey,
      message: errorMessage,
      count: this.errorCounts.get(errorKey)?.count,
      context,
      timestamp: new Date().toISOString(),
    });

    // Auto-recovery for high-frequency errors
    if (this.errorCounts.get(errorKey)!.count > 10) {
      this.triggerRecovery(errorKey);
    }
  }

  updateHealthCheck(name: string, status: HealthCheck['status'], details?: string): void {
    this.healthChecks.set(name, {
      name,
      status,
      lastCheck: new Date(),
      details,
    });

    console.log('Health check updated:', {
      name,
      status,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  getHealthStatus(): {
    overall: 'healthy' | 'unhealthy' | 'degraded';
    checks: HealthCheck[];
    errors: ErrorMetrics[];
  } {
    const checks = Array.from(this.healthChecks.values());
    const errors = Array.from(this.errorCounts.values());

    // Determine overall status
    let overall: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';

    if (checks.some(check => check.status === 'unhealthy')) {
      overall = 'unhealthy';
    } else if (checks.some(check => check.status === 'degraded')) {
      overall = 'degraded';
    }

    // Factor in error rates
    const recentErrors = errors.filter(error =>
      Date.now() - error.lastOccurred.getTime() < 300000 // 5 minutes
    );

    if (recentErrors.length > 5) {
      overall = overall === 'healthy' ? 'degraded' : overall;
    }

    return { overall, checks, errors };
  }

  private triggerRecovery(errorType: string): void {
    console.warn('Triggering recovery for error type:', errorType);

    // Reset error count after triggering recovery
    this.errorCounts.delete(errorType);

    // Add specific recovery actions based on error type
    switch (errorType) {
      case 'NetworkError':
        this.updateHealthCheck('network', 'degraded', 'High network error rate detected');
        break;
      case 'TimeoutError':
        this.updateHealthCheck('performance', 'degraded', 'High timeout rate detected');
        break;
      case 'APIKeyError':
        this.updateHealthCheck('authentication', 'unhealthy', 'API key issues detected');
        break;
      default:
        this.updateHealthCheck('general', 'degraded', `High error rate for ${errorType}`);
    }
  }

  clearErrorCounts(): void {
    this.errorCounts.clear();
    console.log('Error counts cleared by monitor');
  }

  disable(): void {
    this.isEnabled = false;
    console.log('Application monitor disabled');
  }

  enable(): void {
    this.isEnabled = true;
    console.log('Application monitor enabled');
  }
}

export const monitor = ApplicationMonitor.getInstance();

export function withMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  operationName: string
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error: Error) => {
          monitor.recordError(error, { operation: operationName, args });
          throw error;
        });
      }

      return result;
    } catch (error) {
      monitor.recordError(error as Error, { operation: operationName, args });
      throw error;
    }
  }) as T;
}

export function createHealthCheckEndpoint() {
  return (request: Request): Response => {
    try {
      const healthStatus = monitor.getHealthStatus();

      const statusCode = healthStatus.overall === 'healthy' ? 200 :
                        healthStatus.overall === 'degraded' ? 200 : 503;

      return new Response(JSON.stringify({
        status: healthStatus.overall,
        timestamp: new Date().toISOString(),
        checks: healthStatus.checks,
        errorSummary: healthStatus.errors.map(e => ({
          type: e.type,
          count: e.count,
          lastOccurred: e.lastOccurred,
        })),
      }), {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: 'unhealthy',
        error: 'Failed to generate health check',
        timestamp: new Date().toISOString(),
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}