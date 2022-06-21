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
  console.log(`getGame ${id}`);
  return gameService.read(id);
};


const createGame = async (id, players = []) => {
  console.log(`createGame ${id}`);
  const record = await gameService.read(id);
  if (record.length) return null;

  await gameService.write(id);

  const cards = createDeck();
  return createBoard(cards, players);
};

const resetGame = async (id) => {
  console.log(`resetGame ${id}`)

  const record = await gameService.read(id);
  if (!record.length) return null;

  return gameService.destroy(id);
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