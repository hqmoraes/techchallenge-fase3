// kubernetes-app/src/infrastructure/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fastfood-app' },
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;