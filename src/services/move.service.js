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
} = require('./redis.service');


// ===============  MODULE FUNCTIONS

/**
 * Adds card to discard pile
 * @returns {game} cards
 */
const addToDiscardPile = async (sessionId, cards) => {
  const session = await redisAdd(sessionId, DISCARD_PILE, cards, 'object');
  return session[DISCARD_PILE];
};

/**
 * Adds cards to main deck
 * 
 * @returns {game} cards
 */
const addToMainDeck = async (sessionId, cards) => {
  const session = await redisAdd(sessionId, MAIN_DECK, cards, 'object');
  return session[MAIN_DECK];
}

/**
 * Adds cards to player's hand
 * @returns {game} cards
 */
const addToPlayerHand = async (sessionId, player, cards) => {
  const playerKey = `${PLAYER}${player}`
  const session = await redisAdd(sessionId, playerKey, cards, 'object');
  return session[playerKey];
}

/**
 * Returns player's hand
 * @returns {game} cards
 */
const readPlayersHand = async (sessionId, player) => {
  const playerKey = `${PLAYER}${player}`
  return redisGet(sessionId, playerKey, 'array');
}

/**
 * Returns discard pile
 * @returns {game} cards
 */
const readDiscardPile = async (sessionId) => {
  return redisGet(sessionId, DISCARD_PILE, 'array');
}

// ==== SELECT FUNCTIONS 
// select main deck card
// select discard pile card
// select players hand card

// ==== UPDATE FUNCTIONS
// swap cards
// insert card into current players hand

module.exports = {
  addToMainDeck,
  addToPlayerHand,
  addToDiscardPile,
  readPlayersHand,
  readDiscardPile,
}