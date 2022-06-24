// =============== IMPORTS

const {
  gameService,
} = require('../services/index');
const {
  createDeck,
  createBoard,
} = require('./deck.controller');
const Logger = require('../utils/Logger');

// =============== CONSTS

const LOGGER = new Logger('GameController');

// ===============  MODULE FUNCTIONS

const getGame = async (id, logger = LOGGER) => {
  logger.setFuncName('getGame');

  return gameService.read(id, logger);
};

const createGame = async (id, players = [], logger = LOGGER) => {
  logger.setFuncName('createGame');
  const record = await gameService.read(id, logger);
  if (record.length) return null; // already exists, throw error

  await gameService.write(id, logger);

  const cards = createDeck(logger);
  return createBoard(cards, players, logger);
};

const resetGame = async (id, logger = LOGGER) => {
  logger.setFuncName('resetGame');

  const record = await gameService.read(id, logger);
  if (!record.length) return null; // does not exist, throw error

  return gameService.destroy(id, logger);
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