const winston = require('winston');

const dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};

const baseLog = (info, route) => {
  return `${dateFormat()} | ${info.level.toUpperCase()} | module:${route} | `;
};

const appendRequestId = (message, requestId) => {
  return message + `requestId:${requestId} | `;
};

const appendObject = (message, info) => {
  return message + `data:${JSON.stringify(info.obj)} | `;
};

const appendLogData = (message, logData) => {
  return message + `log_data:${JSON.stringify(logData)} | `;
};

const appendInfoMessage = (message, info) => {
  return message + `${info.message} `;
}

class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.request_id = null;
    this.route = route;
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({filename: `./logs/${route}.log`})
      ],
      format: winston.format.printf((info) => {
        let message = baseLog(info, route);
        if (this.request_id) message = appendRequestId(message, this.request_id);
        if (info.obj) message = appendObject(message, info);
        if (this.log_data) message = appendLogData(message, this.log_data);
        return appendInfoMessage(message, info);
      })
    });
    this.logger = logger
  };

  setLogData(log_data) {
    this.log_data = log_data
  };

  setRequestId(request_id) {
    this.request_id = request_id
  };

  async info(message) {
    this.logger.log('info', message);
  };

  async info(message, obj) {
    this.logger.log('info', message, {
      obj
    })
  };

  async debug(message) {
    this.logger.log('debug', message);
  }

  async debug(message, obj) {
    this.logger.log('debug', message, {
      obj
    })
  };

  async error(message) {
    this.logger.log('error', message);
  }

  async error(message, obj) {
    this.logger.log('error', message, {
      obj
    })
  };
};
module.exports = LoggerService; 