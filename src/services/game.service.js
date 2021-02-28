// =============== IMPORTS
const {
  redisGet,
  redisDelete,
} = require('./redis.service');


// ===============  MODULE FUNCTIONS

/**
 * Gets full game cards
 * @returns {object}
 */
const getGameState = sessionId => redisGet(sessionId, null, 'object');

/**
 * Clears game
 * @returns {integer}
 */
const clearGameState = sessionId => redisDelete(sessionId, null, 'object');

module.exports = {
  getGameState,
  clearGameState,
}
