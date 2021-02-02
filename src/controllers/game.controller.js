const {
  MOVE_TYPES: {
    SHOW_PLAYERS_HAND,
    SHOW_DISCARD_PILE,
    SELECT_CARD_FROM_DISCARD_PILE,
    SELECT_CARD_FROM_MAIN_DECK,
    SELECT_CARD_FROM_HAND,
    SWAP_CARDS,
  }
} = require('../config/constants/game.constants');
const {
  redisAdd,
  redisGet
} = require('../services/redis.service');

// ===============  MODULE FUNCTIONS

const createGame = () => {
  const deck = shuffleCards(newDeck());
}

const playMove = ({
  type,

}) => {

};


// ===============  HELPER FUNCTIONS

// ===============  Game setup
/**
 * Returns a new deck
 * @returns {Array} deck
 */
function newDeck() {
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return deck;
};

/**
 * Returns a deck in random order
 * @param {Array} deck 
 * @returns {Array} deck 
 */
function shuffleCards(deck = []) {
  if (deck.length <= 1) {
    throw new Error('There must be at least 2 cards to shuffle')
  }
  return deck.sort(() => Math.random() - 0.5)
};

/**
 * Return the player hands, main deck and discard pile
 * @param {Array} deck 
 * @param {Number} playerCount 
 * @returns {Object} gameCards 
 */
async function dealCards(deck = [], players = []) {
  if (deck.length == 0) {
    deck = newDeck();
    deck = shuffleCards(deck)
  };

  if (players.length <= 1) {
    throw new Error('There must be at least 2 players')
  }

  if (players.length > 4) {
    throw new Error('Cannot exceed amount of 4 players')
  };

  const gameCards = {
    mainDeck: [],
    discardPile: [],
    players: {}
  };

  players.forEach(async (player) => {
    gameCards.players[player] = deck.splice(0, 10);
    gameCards.mainDeck = deck;
    await redisAdd(player, gameCards.players[player], 'array');
    // await redisGet(player, 'array');
  });

  gameCards.discardPile.push(gameCards.mainDeck[0]);
  gameCards.mainDeck.shift();
  await redisAdd('mainDeck', gameCards.mainDeck, 'array');

  await redisAdd('discardPile', gameCards.discardPile, 'array');
  // await redisGet('mainDeck', 'array');
  // await redisGet('discardPile', 'array');
  return gameCards;
};

/**
 * Reshuffles discard pile into main deck and returns full game deck
 * @param {Object} gameCards 
 * @returns {Object} gameCards
 */
function reshuffleDiscardPile(gameCards = {}) {
  if (gameCards.mainDeck.length != 0) {
    throw new Error('Main deck needs to be empty for a reshuffle');
  };

  if (gameCards.discardPile.length === 0) {
    throw new Error('Cannot reshuffle empty discard pile')
  }

  const discardPile = gameCards.discardPile.splice(1, gameCards.discardPile.length)
  gameCards.mainDeck = shuffleCards(discardPile);

  return gameCards;
}

// ===============  Show card 
/**
 * Returns curent players hand
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @return {Array} 
 */
function showPlayersHand(gameCards = {}, player = null) {
  if (!player) {
    throw new Error('playerId cannot be undefined')
  }

  if (gameCards.players[player].length === 0) {
    throw new Error('Cannot display zero cards');
  };

  return gameCards.players[player];
};

/**
 * Returns top card of discard pile
 * @param {Object} gameCards 
 * @return {Array}
 */
function showDiscardPile(gameCards = {}) {
  if (gameCards.discardPile.length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  return gameCards.discardPile[0];
};

// =============== Select card functions
/**
 * Returns removed top card of discard pile
 * @param {Object} gameCards
 * @return {Number} selectedCard
 */
function selectCardFromDiscardPile(gameCards = {}) {
  if (gameCards.discardPile.length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  const selectedCard = gameCards.discardPile.splice(0, 1);
  return selectedCard[0];
};

/**
 * Returns removed top card of main deck
 * @param {Object} gameCards 
 * @return {Number} selectedCard
 */
function selectCardFromMainDeck(gameCards = {}) {
  if (gameCards.mainDeck.length === 0) {
    throw new Error('Main deck cannot be empty');
  }

  const selectedCard = gameCards.mainDeck.splice(0, 1);
  return selectedCard[0];
};

/**
 * Returns selected number from player's hand
 * @param {Array} cards 
 * @param {Number} selectedCard 
 * @return {Number}
 */
function selectCardFromHand(cards = [], selectedCard = null) {
  if (cards.length === 0) {
    throw new Error('Current player\'s hand cannot be empty')
  }

  if (!selectedCard) {
    throw new Error('Selected card must be passed in')
  }

  if (
    typeof selectedCard != "number" ||
    (Number(selectedCard) === selectedCard && selectedCard % 1 !== 0)
  ) {
    throw new Error('Selected card must be an integer')
  }

  return cards.find(card => card == selectedCard);
};

// ===============  Swap card functions
/**
 * Swaps cards and returns full game deck
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @param {Number} selectedHandCard 
 * @param {Number} selectedDeckCard
 * @return {Object} gameCards
 */
function swapCards(gameCards = {}, playerId = null, selectedHandCard = null, selectedDeckCard = null) {
  // Insert card into current hand
  const currentHand = gameCards.players[playerId];
  currentHand.splice(currentHand.indexOf(selectedHandCard), 0, selectedDeckCard);
  const updatedHand = currentHand.filter(card => card != selectedHandCard);
  gameCards.players[playerId] = updatedHand;

  // Add to discard pile
  gameCards.discardPile.unshift(selectedHandCard)

  // reshuffle discard pile if main deck is empty
  if (gameCards.mainDeck.length === 0) {
    reshuffleDiscardPile(gameCards)
  }

  const rackoh = checkForRackOh(gameCards, playerId);
  if (rackoh) {
    gameCards.winner = playerId;
  }

  return gameCards;
};

//===============  End game functions
/**
 * Checks if player's hand is in numerical order
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @return {Boolean}
 */
function isRackOh(gameCards, playerId = null) {
  let isWinner = true;
  for (i = 1; i < gameCards.players[playerId].length; i++) {
    const currVal = gameCards.players[playerId][i];
    const prevVal = gameCards.players[playerId][i - 1];
    if (currVal < prevVal) {
      isWinner = false;
    }
  }
  return isWinner;
};

function checkForRackOh(gameCards = {}, playerId = null) {
  if (!playerId) {
    throw new Error('playerId cannot be undefined')
  }

  const winner = isRackOh(gameCards, playerId);
  if (winner) {
    return playerId;
  }
  return;
};

module.exports = {
  // MODULE FUNCTIONS
  createGame,
  playMove,
  // HELPER FUNCTIONS
  newDeck,
  shuffleCards,
  dealCards,
  reshuffleDiscardPile,
  showPlayersHand,
  showDiscardPile,
  selectCardFromDiscardPile,
  selectCardFromMainDeck,
  selectCardFromHand,
  swapCards,
  isRackOh,
  checkForRackOh
};