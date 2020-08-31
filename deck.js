function newDeck() {
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return deck;
}

function shuffleDeck(deck = []) {
  if (deck.length == 0) {
    deck = newDeck();
  }
  return deck.sort(() => Math.random() - 0.5)
}

function dealCards(deck = [], playersCount) {
  if (deck.length == 0) {
    deck = newDeck();
  }

  if (playersCount > 4) {
    throw new Error('Cannot exceed amount of 4 players')
  }

  const mainDeck = {
    remainingCards: {},
    playersCards: []
  };
  for (i = 1; i < playersCount + 1; i++) {
    mainDeck.playersCards.push({
      [`player${i}`]: deck.splice(0, 10)
    });
    mainDeck.remainingCards = deck;
  }

  return mainDeck;
}

module.exports = {
  newDeck,
  shuffleDeck,
  dealCards
}