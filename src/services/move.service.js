// =============== IMPORTS

const { redisConstants } = require('@constants');
const redisService = require('./redis.service');

// =============== CONSTS

const PLAYER_KEY = redisConstants.PLAYER;
const MAIN_DECK_KEY = redisConstants.MAIN_DECK;
const DISCARD_PILE_KEY = redisConstants.DISCARD_PILE;


// ===============  MODULE FUNCTIONS

/**
 * Adds card to discard pile
 * @returns {game} cards
 */
const addToDiscardPile = async (sessionId, cards) => {
  const session = await redisService.create(sessionId, DISCARD_PILE_KEY, cards, 'object');
  return session[DISCARD_PILE_KEY];
};

/**
 * Adds cards to main deck
 * 
 * @returns {game} cards
 */
const addToMainDeck = async (sessionId, cards) => {
  const session = await redisService.create(sessionId, MAIN_DECK_KEY, cards, 'object');
  return session[MAIN_DECK_KEY];
}

/**
 * Adds cards to player's hand
 * @returns {game} cards
 */
const addToPlayerHand = async (sessionId, player, cards) => {
  const PLAYER_HAND = `${PLAYER_KEY}${player}`
  const session = await redisService.create(sessionId, PLAYER_HAND, cards, 'object');
  return session[PLAYER_HAND];
}

/**
 * Updates discard pile
 * @param sessionId
 * @returns {game} cards
 */
const updateDiscardPile = async (sessionId, cards) => {
  const session = await redisService.update(sessionId, DISCARD_PILE_KEY, cards, 'object');
  return session[DISCARD_PILE_KEY];
};

/**
 * Updates main deck
 * @param sessionId
 * @returns {game} cards
 */
const updateMainDeck = async (sessionId, cards) => {
  const session = await redisService.update(sessionId, MAIN_DECK_KEY, cards, 'object');
  return session[MAIN];
};

/**
 * Updates players hand
 * @param sessionId
 * @returns {game} cards
 */
const updatePlayerHand = async (sessionId, player, cards) => {
  const PLAYER_HAND = `${PLAYER_KEY}${player}`
  const session = await redisService.update(sessionId, player, cards, 'object');
  return session[PLAYER_HAND];
};


/**
 * Returns player's hand
 * @returns {game} cards
 */
const readPlayerHand = async (sessionId, player) => {
  const PLAYER_HAND = `${PLAYER_KEY}${player}`
  return redisService.read(sessionId, PLAYER_HAND, 'array');
}

/**
 * Returns discard pile
 * @returns {game} cards
 */
const readDiscardPile = async (sessionId) => {
  const discardPile = await redisService.read(sessionId, DISCARD_PILE_KEY, 'array');
  return discardPile[0]
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
  updatePlayerHand,
  readPlayerHand,
  readDiscardPile,
}