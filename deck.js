// Game setup functions
function newDeck() {
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return deck;
};

function shuffleCards(deck = []) {
  if (deck.length == 0) {
    deck = newDeck();
  }
  return deck.sort(() => Math.random() - 0.5)
};

function dealCards(deck = [], playersCount) {
  if (deck.length == 0) {
    deck = newDeck();
  };

  if (playersCount > 4) {
    throw new Error('Cannot exceed amount of 4 players')
  };

  const gameCards = {
    mainDeck: [],
    discardPile: [],
    players: {}
  };
  for (i = 1; i < playersCount + 1; i++) {
    gameCards.players[i] = deck.splice(0, 10);
    gameCards.mainDeck = deck;
  }

  gameCards.discardPile.push(gameCards.mainDeck[0]);
  gameCards.mainDeck.shift();

  return gameCards;
};

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

// Show card functions
function showPlayersHand(gameCards = {}, playerId) {

  if (gameCards.players[playerId].length === 0) {
    throw new Error('Cannot display zero cards');
  };

  return gameCards.players[playerId];
};

function showDiscardPile(gameCards = {}) {
  if (gameCards.discardPile.length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  return gameCards.discardPile[0];
};

// Select card functions
function selectCardFromDiscardPile(gameCards = {}) {
  if (gameCards.discardPile.length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  const updatedPile = gameCards.discardPile.splice(1, gameCards.discardPile.length);
  const selectedCard = gameCards.discardPile;
  gameCards.discardPile = updatedPile;

  return selectedCard;
};

function selectCardFromMainDeck(gameCards = {}) {
  const updatedPile = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
  const selectedCard = gameCards.mainDeck[0];
  gameCards.mainDeck = updatedPile;

  return selectedCard;
};

function selectCardFromHand(cards = [], selectedCard) {
  if (cards.length === 0) {
    throw new Error('Current player\'s hand cannot be empty')
  }

  if (typeof selectedCard != "number") {
    throw new Error('Selected card must be an integer')
  }

  if (
    Number(selectedCard) === selectedCard &&
    selectedCard % 1 !== 0
  ) {
    throw new Error('Selected card must be an integer')
  }

  return cards.find(card => card == selectedCard);
};

// Swap card functions
function swapCards(gameCards = {}, playerId = null, selectedHandCard = null, selectedDeckCard = null) {
  const currentHand = gameCards.players[playerId];
  const indexToSwap = currentHand.indexOf(selectedHandCard);
  currentHand.splice(indexToSwap, 0, selectedDeckCard);
  const updatedHand = currentHand.filter(card => card != selectedHandCard);
  gameCards.discardPile.unshift(selectedHandCard)
  gameCards.players[playerId] = updatedHand;

  if (gameCards.mainDeck.length === 0) {
    reshuffleDiscardPile(gameCards)
  }

  return gameCards;
};

// End game functions
function isRackOh(gameCards, playerId) {
  let isWinner = true;
  for (i = 1; i < gameCards.players[playerId].length; i++) {
    if (gameCards.players[playerId][i] < gameCards.players[playerId][i - 1]) {
      isWinner = false;
    }
  }
  return isWinner;
};

module.exports = {
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
  isRackOh
};