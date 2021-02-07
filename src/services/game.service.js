const {
  redisAdd,
  redisGet
} = require('@services/redis.service');

const {
  REDIS_KEYS: {
    PLAYER
  }
} = require('@config/constants/game.constants')

// ==============
// POST FUNCTIONS ////////////////////////////////////////////
// ==============

// add to main deck
const addToMainDeck = async (sessionId, cards) => {
  return redisAdd(sessionId, 'mainDeck', cards, 'object');
}
// add to discard pile
const addToDiscardPile = async (sessionId, cards) => {
  return redisAdd(sessionId, 'discardPile', cards, 'object');
};
// add to players hands
const addToPlayerHand = async (sessionId, player, cards) => {
  return redisAdd(sessionId, `${PLAYER}${player}`, cards, 'object');
}

// ==============
// SHOW FUNCTIONS ////////////////////////////////////////////
// ==============

// get game state
const getGameState = sessionId => redisGet(sessionId, null, 'object');
// get current player cards
// show discard pile card

// ==============
// SELECT FUNCTIONS ////////////////////////////////////////////
// ==============

// select main deck card
// select discard pile card
// select players hand card

// ==============
// UPDATE FUNCTIONS ////////////////////////////////////////////
// ==============

// swap cards
// insert card into current players hand


module.exports = {
  addToMainDeck,
  addToDiscardPile,
  addToPlayerHand,
  getGameState,
}
