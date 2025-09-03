type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

class DittoLogger {
  private logLevel: LogLevel = 'info';
  private logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
  };

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.logLevel];
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [DITTO DEBUG] ${message}`, data ? data : '');
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`ℹ️  [DITTO INFO] ${message}`, data ? data : '');
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️  [DITTO WARN] ${message}`, data ? data : '');
    }
  }

  error(message: string, error?: any) {
    if (this.shouldLog('error')) {
      console.error(`❌ [DITTO ERROR] ${message}`, error ? error : '');
    }
  }

  group(title: string, callback: () => void) {
    if (this.shouldLog('debug')) {
      console.group(`📦 [DITTO] ${title}`);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else {
      callback();
    }
  }

  success(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.log(`✅ [DITTO SUCCESS] ${message}`, data ? data : '');
    }
  }
}

export const dittoLogger = new DittoLogger();