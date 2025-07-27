// Simple logging utility

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
  }

  _shouldLog(level) {
    const levels = Object.values(LOG_LEVELS);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  error(message, data = null) {
    if (this._shouldLog(LOG_LEVELS.ERROR)) {
      console.error(this._formatMessage(LOG_LEVELS.ERROR, message, data));
    }
  }

  warn(message, data = null) {
    if (this._shouldLog(LOG_LEVELS.WARN)) {
      console.warn(this._formatMessage(LOG_LEVELS.WARN, message, data));
    }
  }

  info(message, data = null) {
    if (this._shouldLog(LOG_LEVELS.INFO)) {
      console.info(this._formatMessage(LOG_LEVELS.INFO, message, data));
    }
  }

  debug(message, data = null) {
    if (this._shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(this._formatMessage(LOG_LEVELS.DEBUG, message, data));
    }
  }

  // Special method for vote logging
  logVote(voteData) {
    this.info('Vote submission', {
      voteId: voteData.id,
      voterId: voteData.voterId,
      candidateId: voteData.candidateId,
      isLastVote: voteData.isLastVote,
      timestamp: new Date().toISOString()
    });
  }

  // Special method for authentication logging
  logAuth(action, userId, success) {
    this.info('Authentication event', {
      action,
      userId,
      success,
      timestamp: new Date().toISOString()
    });
  }
}

export const logger = new Logger(); 