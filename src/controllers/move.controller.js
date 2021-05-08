// =============== IMPORTS

const { gameController } = require('../controllers/index');
const {
  gameService,
  moveService,
} = require('../services/index');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

/**
 * Returns curent players hand
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @return {Array} 
 */
async function showPlayerHand(sessionId, player = null) {
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General error');
  }

  if (!player) {
    throw new Error('player cannot be undefined')
  };

  return moveService.readPlayerHand(
    sessionId,
    player
  );
};

/**
 * Returns top card of discard pile
 * @param {Object} gameCards 
 * @return {Array}
 */
async function showDiscardPile(sessionId) {
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General errror');
  }

  return moveService.readDiscardPile(sessionId);
};

/**
 * Swaps cards and returns full game deck
 * @param {Object} gameCards 
 * @param {Number} playerId 
 * @param {Number} selectedHandCard 
 * @param {Number} selectedDeckCard
 * @return {Object} gameCards
 */
async function updateSwappedCards(sessionId, playerId = null, selectedHandCard = null, drawPile = null) {
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General errror');
  }

  // get deckPile card
  switch (deck) {
    case 'MAIN_DECK':

    case 'DISCARD_PILE':

    default:
  }

  // Insert card into current hand
  const currentHand = session[playerId];
  currentHand.splice(currentHand.indexOf(selectedHandCard), 0, selectedDeckCard);
  const updatedHand = currentHand.filter(card => card != selectedHandCard);
  session[playerId] = updatedHand;

  // Add to discard pile
  session.discardPile.unshift(selectedHandCard)

  // reshuffle discard pile if main deck is empty
  if (session.mainDeck.length === 0) {
    reshuffleDiscardPile(gameCards)
  }

  const rackoh = gameController.checkForRackOh(session, playerId);
  if (rackoh) {
    gameCards.winner = playerId;
  }

  return gameCards;
};

// ===============  HELPER FUNCTIONS

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
 * Returns removed top card of main deck
 * @param {Object} gameCards 
 * @return {Number} selectedCard
 */
async function selectCardFromMainDeck(sessionId) {
  // get session
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General errror');
  }

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
async function selectCardFromPlayerHand(sessionId, card = null, name = null) {
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General errror');
  }

  if (!card) {
    throw new Error('card must be passed in')
  }

  if (
    typeof card != "number" &&
    Number(card) % 1 !== 0
  ) {
    throw new Error('Selected card must be an integer');
  }

  if (!name) {
    throw new Error('name cannot be undefined')
  }

  const player = `${PLAYER_KEY}${name}`
  const hand = session[player];

  if (hand.length === 0) {
    throw new Error('Current player\'s hand cannot be empty')
  }

  if (!hand.find(c => c == Number(c))) {
    throw new Error('Selected card not found in player\'s hand')
  };

  await updatePlayerHand(sessionId, player, card);
};

/**
 * Returns removed top card of discard pile
 * @param {Object} gameCards
 * @return {Number} selectedCard
 */
async function selectCardFromDiscardPile(sessionId) {
  // get session
  const session = await gameService.getGameState(sessionId);
  if (!session) {
    throw new Error('General errror');
  }

  if (session[DISCARD_PILE_KEY].length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  const selectedCard = session[DISCARD_PILE_KEY].splice(0, 1);
  await moveService.updateDiscardPile(sessionId, session[DISCARD_PILE_KEY]);
  return selectedCard[0];
};

module.exports = {
  // MODULE FUNCTIONS
  showPlayerHand,
  showDiscardPile,
  selectCardFromDiscardPile,
  selectCardFromMainDeck,
  selectCardFromPlayerHand,
  updateSwappedCards,
  // HELPER FUNCTIONS
  reshuffleDiscardPile,
};