// =============== IMPORTS
const {
  redisConstants: {
    PLAYER,
    MAIN_DECK,
    DISCARD_PILE
  },
} = require('@constants')
const {
  redisAdd,
  redisGet,
  redisDelete,
} = require('./redis.service');


// ===============  MODULE FUNCTIONS

// ==== POST FUNCTIONS 
/**
 * Adds cards to main deck
 * 
 * @returns {game} cards
 */
const addToMainDeck = async (sessionId, cards) => {
  return redisAdd(sessionId, MAIN_DECK, cards, 'object');
}

/**
 * Adds card to discard pile
 * @returns {game} cards
 */
const addToDiscardPile = async (sessionId, cards) => {
  return redisAdd(sessionId, DISCARD_PILE, cards, 'object');
};

/**
 * Adds cards to player's hand
 * @returns {game} cards
 */
const addToPlayerHand = async (sessionId, player, cards) => {
  return redisAdd(sessionId, `${PLAYER}${player}`, cards, 'object');
}

// ==== SHOW FUNCTIONS
const getGameState = sessionId => redisGet(sessionId, null, 'object');
// get current player cards
// show discard pile card


// ==== SELECT FUNCTIONS 
// select main deck card
// select discard pile card
// select players hand card


// ==== UPDATE FUNCTIONS
// swap cards
// insert card into current players hand


// ==== DELETE FUNCTIONS
const clearGameState = sessionId => redisDelete(sessionId, null, 'object');

module.exports = {
  addToMainDeck,
  addToDiscardPile,
  addToPlayerHand,
  getGameState,
  clearGameState,
}
