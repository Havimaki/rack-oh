function newDeck() {
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return deck;
};

function shuffleDeck(deck = []) {
  if (deck.length == 0) {
    deck = newDeck();
  }
  return deck.sort(() => Math.random() - 0.5)
};

function reshuffleDiscardPile(gameCards = {}) {
  if (gameCards.remainingCards.length != 0) {
    throw new Error('Main deck needs to be empty for a reshuffle');
  };

  if (gameCards.discardPile.length === 0) {
    throw new Error('Cannot reshuffle empty discard pile')
  }

  const cardsToShuffle = gameCards.discardPile.splice(1, gameCards.discardPile.length)
  gameCards.remainingCards = shuffleDeck(cardsToShuffle);
  return gameCards;
}

function dealCards(deck = [], playersCount) {
  if (deck.length == 0) {
    deck = newDeck();
  };

  if (playersCount > 4) {
    throw new Error('Cannot exceed amount of 4 players')
  };

  const mainDeck = {
    remainingCards: [],
    discardPile: [],
    players: {}
  };
  for (i = 1; i < playersCount + 1; i++) {
    mainDeck.players[i] = deck.splice(0, 10);
    mainDeck.remainingCards = deck;
  }

  return mainDeck;
};

function showPlayersCards(gameCards = {}, playerId) {

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
}

function selectCardFromDiscardPile(gameCards = {}) {
  if (gameCards.discardPile.length === 0) {
    throw new Error('Discard pile cannot be empty');
  }

  const newDiscardPile = gameCards.discardPile.splice(1, gameCards.discardPile.length);
  const newDiscardCard = gameCards.discardPile;

  gameCards.discardPile = newDiscardPile;
  return newDiscardCard;
}

// function selectCardFromHand(cards = []) { }


module.exports = {
  newDeck,
  shuffleDeck,
  reshuffleDiscardPile,
  dealCards,
  showPlayersCards,
  showDiscardPile,
  selectCardFromDiscardPile,
};