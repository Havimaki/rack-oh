// =============== IMPORTS

const redisService = require('./redis.service');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

/**
 * Gets full game cards
 * @returns {object}
 */
const getGameState = sessionId => redisService.read(sessionId, null, 'object');

/**
 * Clears game
 * @returns {integer}
 */
const clearGameState = sessionId => redisService.hardDelete(sessionId, null, 'object');

module.exports = {
  getGameState,
  clearGameState,
}
