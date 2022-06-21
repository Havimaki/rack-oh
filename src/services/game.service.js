// =============== IMPORTS

const postgresService = require('./postgres.service');
const Logger = require('../utils/Logger');

// =============== CONSTS

const LOGGER = new Logger('gameService');

// ===============  MODULE FUNCTIONS

const read = async (sessionId, logger = LOGGER) => {
  logger.info(`Reading game`);
  const query = `SELECT * FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.read(query, variables);
}

const write = async (sessionId, logger = LOGGER) => {
  logger.info(`Writing game`);
  const query = `INSERT INTO games(session_id) VALUES ($1)`;
  const variables = [sessionId];
  return postgresService.write(query, variables);
}

const destroy = async (sessionId, logger = LOGGER) => {
  logger.info(`Destroying game`);
  const query = `DELETE FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.destroy(query, variables);
};

module.exports = {
  read,
  write,
  destroy,
}
