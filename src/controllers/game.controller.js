// =============== IMPORTS

const {
  gameService,
} = require('../services/index');
const {
  createDeck,
  createBoard,
} = require('./deck.controller');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

const getGame = async (id) => {
  console.log(`getGame ${id}`)

  const game = await gameService.readGame(id);
  if (!game.length) return game;

  return game[0];
};

const createGame = async (id, players = []) => {
  console.log(`createGame ${id}`)

  const game = await gameService.readGame(id);
  if (game.length) return game;

  await gameService.writeGame(id);

  const cards = createDeck(id);
  const {
    deck,
    discard,
    hands,
  } = createBoard(id, cards, players);
  return {
    deck,
    discard,
    hands,
  }
};

const resetGame = async (id) => {
  console.log(`resetGame ${id}`)

  const game = await gameService.readGame(id);
  if (!game.length) return 0;

  await gameService.destroyGame(id);
  return 1;
};

// ===============  HELPER FUNCTIONS

const checkForRackOh = (hand = []) => {
  for (i = 1; i < hand.length; i++) {
    if (hand[i] < hand[i - 1]) {
      return false;
    }
  }
  return true;
};


module.exports = {
  // MODULE FUNCTIONS
  getGame,
  resetGame,
  createGame,
  // HELPER FUNCTIONS
  checkForRackOh,
};