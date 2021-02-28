// =============== IMPORTS
// ===============  MODULE FUNCTIONS

/**
 * Returns a new deck
 * @returns {Array} deck
 */
const playMove = ({
  type,

}) => {

};


// ===============  HELPER FUNCTIONS

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

// ===============  Show card functions
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

module.exports = {
  // MODULE FUNCTIONS
  playMove,
  // HELPER FUNCTIONS
  reshuffleDiscardPile,
  showPlayersHand,
  showDiscardPile,
  selectCardFromDiscardPile,
  selectCardFromMainDeck,
  selectCardFromHand,
  swapCards,
};