// =============== IMPORTS
const {
  deckService,
} = require('../services/index');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

/**
 * Returns a new deck
 * @returns {Array} deck
 */
const createDeck = () => {
  console.log(`createDeck`)
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return shuffleCards(deck);
};

/**
 * Return the player hands, main deck and discard pile
 * @param {Array} deck 
 * @param {Number} playerCount 
 * @returns {Object} gameCards 
 */
const createBoard = async (cards = [], players = []) => {
  console.log(`createBoard`)
  if (!cards.length) cards = createDeck();
  if (!players.length) throw new Error('There must be at least 2 players')
  if (players.length > 4) throw new Error('Cannot exceed amount of 4 players')

  const { hands, deck } = await addToPlayerHands(players, cards);
  const { discard, deck: updatedDeck } = await addToDiscardPile(deck)
  // await addToMainDeck(deck);

  return {
    deck: updatedDeck,
    discard,
    hands,
  };
};

// ===============  HELPER FUNCTIONS

const addToPlayerHands = async (players, cards) => {
  console.log(`addToPlayerHands`)
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

const addToDiscardPile = async (deck) => {
  console.log(`addToDiscardPile`)
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
const shuffleCards = (deck = []) => {
  console.log('shuffleCards')
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