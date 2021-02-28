// =============== IMPORTS
const {
  gameService: {
    addToMainDeck,
    addToDiscardPile,
    addToPlayerHand,
    getGameState,
    clearGameState,
  }
} = require('@services');

// ===============  MODULE FUNCTIONS
/**
 * Sets up a new game
 * @param {Array} players 
 * @param {string} id 
 * @returns {game} cards
 */
const createGame = async (players = [], id) => {
  // only create new game if none exist yet
  const game = await getGame(id);
  if (!!game && Object.keys(game).length > 0) {
    return false;
  }

  // create game
  const deck = newDeck();
  const shuffledCards = shuffleCards(deck);
  return dealCards(
    shuffledCards,
    players,
    id
  );
};

/**
 * Sets up a new game
 * @param {integer} id 
 * @returns {game} cards
 */
const getGame = async (id) => {
  const game = await getGameState(id);
  if (Object.keys(game).length === 0) {
    return false;
  }
  return game;
};

/**
 * Sets up a new game
 * @param {integer} id 
 * @returns {game} cards
 */
const resetGame = async (id) => {
  const gameCleared = await clearGameState(id);
  if (!!gameCleared) {
    return true;
  }
  return;
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
async function dealCards(deck = [], players = [], sessionId) {
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
    await addToPlayerHand(
      sessionId,
      player,
      gameCards.players[player],
    );
  });

  gameCards.discardPile.push(gameCards.mainDeck[0]);
  gameCards.mainDeck.shift();

  await addToMainDeck(sessionId, gameCards.mainDeck);
  await addToDiscardPile(sessionId, gameCards.discardPile);
  const game = await getGameState(sessionId)

  return { ...game };
};

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
  getGame,
  resetGame,
  createGame,
  // HELPER FUNCTIONS
  newDeck,
  shuffleCards,
  dealCards,
  isRackOh,
  checkForRackOh
};