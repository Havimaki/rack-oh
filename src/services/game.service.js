const {
  redisAdd,
  redisGet
} = require('@services/redis.service');

// ==============
// POST FUNCTIONS ////////////////////////////////////////////
// ==============

// add to main deck
const addToMainDeck = async (cards) => {
  return redisAdd('mainDeck', cards, 'array');
}
// add to discard pile
const addToDiscardPile = async (cards) => {
  return redisAdd('discardPile', cards, 'array');
};
// add to players hands
const addToPlayerHand = async (player, cards) => {
  return redisAdd(player, cards, 'array');
}

// ==============
// SHOW FUNCTIONS ////////////////////////////////////////////
// ==============

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
}
