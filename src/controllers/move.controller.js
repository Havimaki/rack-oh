// =============== IMPORTS

const { redisConstants } = require('@constants');
const { gameController } = require('@controllers');
const {
  gameService,
  moveService,
} = require('@services');

// =============== CONSTS

const PLAYER_KEY = redisConstants.PLAYER;
const MAIN_DECK_KEY = redisConstants.MAIN_DECK;
const DISCARD_PILE_KEY = redisConstants.DISCARD_PILE;

// ===============  MODULE FUNCTIONS

/**
 * Returns a new deck
 * @returns {Array} deck
 */
const playMove = ({
  type
}) => {

};


// ===============  HELPER FUNCTIONS

/**
 * Returns curent players hand
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @return {Array} 
 */
async function showPlayersHand(sessionId, player = null) {
  if (!player) {
    throw new Error('playerId cannot be undefined')
  };

  return moveService.readPlayersHand(sessionId, player);
};

/**
 * Returns top card of discard pile
 * @param {Object} gameCards 
 * @return {Array}
 */
async function showDiscardPile(sessionId) {
  const discardPile = await moveService.readDiscardPile(sessionId);
  return discardPile[0];
};

/**
 * Reshuffles discard pile into main deck and returns full game deck
 * @param {Object} gameCards 
 * @returns {Object} gameCards
 */
async function reshuffleDiscardPile(sessionId) {
  // get session
  const session = await gameService.getGameState(sessionId);
  if (session[MAIN_DECK_KEY].length != 0) {
    throw new Error('Main deck needs to be empty for a reshuffle');
  };

  if (session[DISCARD_PILE_KEY].length === 0) {
    throw new Error('Cannot reshuffle empty discard pile')
  };

  // update discard pile
  const reshuffledDeck = session[DISCARD_PILE_KEY].splice(1, session[DISCARD_PILE_KEY].length)
  await moveService.updateDiscardPile(sessionId, session[DISCARD_PILE_KEY]);

  // update main deck
  session[MAIN_DECK_KEY] = gameController.shuffleCards(reshuffledDeck);
  await moveService.updateMainDeck(sessionId, session[MAIN_DECK_KEY]);

  // get updated game
  const game = await gameService.getGameState(sessionId);
  return { ...game };
}

/**
 * Returns removed top card of discard pile
 * @param {Object} gameCards
 * @return {Number} selectedCard
 */
async function selectCardFromDiscardPile(sessionId) {
  // get session
  const session = await gameService.getGameState(sessionId);
  if (session[DISCARD_PILE_KEY].length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  const selectedCard = session[DISCARD_PILE_KEY].splice(0, 1);
  await moveService.updateDiscardPile(sessionId, session[DISCARD_PILE_KEY]);
  return selectedCard[0];
};

/**
 * Returns removed top card of main deck
 * @param {Object} gameCards 
 * @return {Number} selectedCard
 */
async function selectCardFromMainDeck(sessionId) {
  // get session
  const session = await gameService.getGameState(sessionId);
  if (session[MAIN_DECK_KEY].length === 0) {
    throw new Error('Main deck cannot be empty');
  }

  const selectedCard = session[MAIN_DECK_KEY].splice(0, 1);
  await moveService.updateMainDeck(sessionId, session[MAIN_DECK_KEY]);
  return selectedCard[0];
};

/**
 * Returns selected number from player's hand
 * @param {Array} cards 
 * @param {Number} selectedCard 
 * @return {Number}
 */
async function selectCardFromHand(sessionId, selectedCard = null, player = null) {
  // get session
  const session = await gameService.getGameState(sessionId);
  const PLAYER_HAND = PLAYER_KEY + player;
  if (session[PLAYER_HAND].length === 0) {
    throw new Error('Current player\'s hand cannot be empty')
  }

  if (!selectedCard) {
    throw new Error('Selected card must be passed in')
  }

  if (
    typeof selectedCard != "number" &&
    Number(selectedCard) % 1 !== 0
  ) {
    throw new Error('Selected card must be an integer');
  }

  if (!cards.find(card => card == Number(selectedCard))) {
    throw new Error('Selected card not found in player\'s hand')
  };

  const selectedCard = session[PLAYER_HAND].splice(0, 1);
  await updatePlayerHand(sessionId, session[PLAYER_HAND]);
};

/**
 * Swaps cards and returns full game deck
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @param {Number} selectedHandCard 
 * @param {Number} selectedDeckCard
 * @return {Object} gameCards
 */
async function swapCards(sessionId, gameCards = {}, playerId = null, selectedHandCard = null, selectedDeckCard = null) {
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

  const rackoh = gameController.checkForRackOh(gameCards, playerId);
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