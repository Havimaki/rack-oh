function newDeck() {
  let deck = [];
  for (i = 1; i < 61; i++) {
    deck.push(i)
  }
  return deck;
}

function shuffleDeck(deck = []) {
  if (deck.length == 0) {
    return;
  }
  return deck.sort(() => Math.random() - 0.5)
}

function dealCards(deck = [], playersCount) {
  if (deck.length == 0) {
    return;
  }
  const mainDeck = {
    remainingCards: {},
    playersCards: []
  };
  for (i = 1; i < playersCount + 1; i++) {
    mainDeck.playersCards.push({
      [`player${i}`]: deck.splice(0, 10)
    });
    mainDeck.remainingDeck = deck;
  }

  return mainDeck;
}

module.exports = {
  newDeck,
  shuffleDeck,
  dealCards
}