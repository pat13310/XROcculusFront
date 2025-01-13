import { supabase } from '../lib/supabase';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private context: string;
  private enabled: boolean;
  private queue: LogEntry[] = [];
  private isProcessing = false;

  constructor(context: string) {
    this.context = context;
    this.enabled = import.meta.env.MODE === 'development';
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const session = await supabase.auth.getSession();

    if (session.data.session) {
      while (this.queue.length > 0) {
        const entry = this.queue.shift();
        if (!entry) continue;

        try {
          await supabase
            .from('system_logs')
            .insert([entry])
            .select();
        } catch (error) {
          console.warn('Échec de la sauvegarde du log:', error);
        }
      }
    }

    this.isProcessing = false;
  }

  private async log(level: LogLevel, message: string, context?: Record<string, any>) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: {
        component: this.context,
        ...context
      }
    };

    // Toujours logger dans la console en développement
    console[level](
      `[${entry.timestamp}] [${level.toUpperCase()}] [${this.context}]:`,
      message,
      context || ''
    );

    // Ajouter à la queue pour traitement asynchrone
    this.queue.push(entry);
    this.processQueue();
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

export function createLogger(context: string) {
  return new Logger(context);
}