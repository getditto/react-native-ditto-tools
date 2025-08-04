type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

interface LoggerConfig {
  enabled: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig = {
    enabled: __DEV__,
    prefix: '[DittoTools]'
  };

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toLocaleTimeString();
    const levelEmoji = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    };
    
    return `${this.config.prefix} ${levelEmoji[level]} ${timestamp} - ${message}`;
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.config.enabled) return;

    const formattedMessage = this.formatMessage(level, message);
    
    switch (level) {
      case 'error':
        console.error(formattedMessage, data || '');
        break;
      case 'warning':
        console.warn(formattedMessage, data || '');
        break;
      default:
        console.log(formattedMessage, data || '');
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  success(message: string, data?: any) {
    this.log('success', message, data);
  }

  warning(message: string, data?: any) {
    this.log('warning', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  async group(title: string, fn: () => void | Promise<void>) {
    if (!this.config.enabled) return;
    
    console.group(`${this.config.prefix} ${title}`);
    await fn();
    console.groupEnd();
  }

  table(data: any) {
    if (!this.config.enabled) return;
    console.table(data);
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }
}

export const logger = new Logger();