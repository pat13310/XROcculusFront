
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

// Utiliser une fonction de création de logger différée
export function createLogger(context: string) {
  return {
    info: (message: string, context?: Record<string, any>) => {
      console.info(`[INFO] [${context}]:`, message);
    },
    warn: (message: string, context?: Record<string, any>) => {
      console.warn(`[WARN] [${context}]:`, message);
    },
    error: (message: string, context?: Record<string, any>) => {
      console.error(`[ERROR] [${context}]:`, message);
    },
    debug: (message: string, context?: Record<string, any>) => {
      console.debug(`[DEBUG] [${context}]:`, message);
    }
  };
}

// Exemple de logger plus complet si nécessaire
class Logger {
  private context: string;
  private enabled: boolean;

  constructor(context: string) {
    this.context = context;
    this.enabled = import.meta.env.MODE === 'development';
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (!this.enabled) return;

    console[level](
      `[${new Date().toISOString()}] [${level.toUpperCase()}] [${this.context}]:`,
      message,
      context || ''
    );
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }
}