// =============== IMPORTS
const {
  redisConstants: {
    PLAYER,
    MAIN_DECK,
    DISCARD_PILE
  },
} = require('@constants');
const {
  redisAdd,
  redisUpdate,
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
  const PLAYER_HAND = `${PLAYER}${player}`
  const session = await redisAdd(sessionId, PLAYER_HAND, cards, 'object');
  return session[PLAYER_HAND];
}

/**
 * Updates discard pile
 * @param sessionId
 * @returns {game} cards
 */
const updateDiscardPile = async (sessionId, cards) => {
  const session = await redisUpdate(sessionId, DISCARD_PILE, cards, 'object');
  return session[DISCARD_PILE];
};

/**
 * Updates main deck
 * @param sessionId
 * @returns {game} cards
 */
const updateMainDeck = async (sessionId, cards) => {
  const session = await redisUpdate(sessionId, MAIN_DECK, cards, 'object');
  return session[MAIN];
};

/**
 * Updates players hand
 * @param sessionId
 * @returns {game} cards
 */
const updatePlayersHand = async (sessionId, cards) => {
  const PLAYER_HAND = `${PLAYER}${player}`
  const session = await redisUpdate(sessionId, PLAYER_HAND, cards, 'object');
  return session[PLAYER_HAND];
};


/**
 * Returns player's hand
 * @returns {game} cards
 */
const readPlayersHand = async (sessionId, player) => {
  const PLAYER_HAND = `${PLAYER}${player}`
  return redisGet(sessionId, PLAYER_HAND, 'array');
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
  updateDiscardPile,
  updateMainDeck,
  updatePlayersHand,
  readPlayersHand,
  readDiscardPile,
}