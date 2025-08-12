/**
 * Centralized logging utility for Kooreh application
 * Provides consistent logging across the application with different levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Default log level - can be overridden by environment variable
const DEFAULT_LOG_LEVEL = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
const CURRENT_LOG_LEVEL = parseInt(import.meta.env.VITE_LOG_LEVEL || DEFAULT_LOG_LEVEL);

class Logger {
  constructor(context = 'Kooreh') {
    this.context = context;
  }

  /**
   * Log error messages
   */
  error(message, ...args) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(`[${this.context}] ERROR:`, message, ...args);
    }
  }

  /**
   * Log warning messages
   */
  warn(message, ...args) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(`[${this.context}] WARN:`, message, ...args);
    }
  }

  /**
   * Log info messages
   */
  info(message, ...args) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      console.info(`[${this.context}] INFO:`, message, ...args);
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message, ...args) {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      console.debug(`[${this.context}] DEBUG:`, message, ...args);
    }
  }

  /**
   * Create a logger instance for a specific context
   */
  createLogger(context) {
    return new Logger(context);
  }
}

// Create default logger instance
const logger = new Logger();

// Export both the class and default instance
export { Logger, logger as default };
