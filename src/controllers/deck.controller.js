// =============== IMPORTS
const {
  deckService,
} = require('../services/index');
const Logger = require('../utils/Logger');

// =============== CONSTS

const LOGGER = new Logger('DeckController');

// ===============  MODULE FUNCTIONS

/**
 * Returns a new deck
 * @returns {Array} deck
 */
const createDeck = (logger = LOGGER) => {
  logger.setFuncName('createDeck');
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return shuffleCards(deck, logger);
};

/**
 * Return the player hands, main deck and discard pile
 * @param {Array} deck 
 * @param {Number} playerCount 
 * @returns {Object} gameCards 
 */
const createBoard = async (cards = [], players = [], logger = LOGGER) => {
  logger.setFuncName('createBoard');
  if (!cards.length) cards = createDeck(logger);
  if (!players.length) throw new Error('There must be at least 2 players')
  if (players.length > 4) throw new Error('Cannot exceed amount of 4 players')

  const { hands, deck } = await addToPlayerHands(players, cards, logger);
  const { discard, deck: updatedDeck } = await addToDiscardPile(deck, logger)
  // await addToMainDeck(deck);

  return {
    deck: updatedDeck,
    discard,
    hands,
  };
};

// ===============  HELPER FUNCTIONS

const addToPlayerHands = async (players, cards, logger = LOGGER) => {
  logger.setFuncName('addToPlayerHands')
  let hands = new Array(players.length - 1);
  for (let player = 0; player < players.length; player++) {
    hands[player] = {
      player: players[player],
      hand: cards.splice(0, 10)
    };
    // await moveService.addToPlayerHand(player, hand);
  }
  return {
    hands,
    deck: cards,
  };
}

const addToDiscardPile = async (deck, logger = LOGGER) => {
  logger.setFuncName('addToDiscardPile')
  const topCard = deck.splice(0, 1);
  let discard = topCard;
  // await moveService.writeToDiscard(discard);
  return {
    discard,
    deck,
  };
}

// const addToMainDeck = async (deck) => {
//   await moveService.addToMainDeck(deck);
// }

/**
 * Returns a deck in random order
 * @param {Array} deck 
 * @returns {Array} deck 
 */
const shuffleCards = (deck = [], logger = LOGGER) => {
  logger.setFuncName('shuffleCards')
  if (deck.length <= 1) {
    throw new Error('There must be at least 2 cards to shuffle')
  }
  return deck.sort(() => Math.random() - 0.5)
};

module.exports = {
  // MODULE FUNCTIONS
  createDeck,
  shuffleCards,
  createBoard,
  // HELPER FUNCTIONS
};