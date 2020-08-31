const {
  newDeck,
  shuffleDeck,
  reshuffleDiscardPile,
  dealCards,
  showDiscardPile,
  showPlayersCards,
  selectCardFromDiscardPile
} = require('./deck');

/** 
 * DECK SETUP REQUIREMENTS
 * - Should deal 10 cards per player from a deck of 60 cards
 * - Should have deck, numerated 1 through 60 with no repeated integers
 * - Should deal cards in shuffled manner
 * 
*/
test('Should deal a deck of 60 cards', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleDeck(newDeck())
  ];

  // Then
  decks.forEach((deck) => expect(deck.length).toBe(60));
});

test('Should always shuffle a new deck if deck is empty or no deck if passed in', () => {
  // Given
  const emptyDeck = [];
  const deck = shuffleDeck(emptyDeck);

  // Then 
  expect(deck.length).toBe(60)
});

test('Should always shuffle discard deck with only the deck items passed in', () => {
  // Given
  const preShuffle = [];
  const postShuffle = [];
  for (i = 0; i < 20; i++) {
    preShuffle.push(i)
    postShuffle.push(i)
  }

  // When
  const deck = shuffleDeck(postShuffle);

  // Then 
  expect(deck).not.toBe(preShuffle)
});

test('Should always have a deck that contains every interger from 1 to 60', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleDeck(newDeck())
  ];
  const checkDecks = decks.map(deck => {
    return deck.filter(card => {
      return (
        (card == 1 || card == 60)
        && card > 0
        && card < 61
      );
    }).length > 0;
  });

  // Then
  checkDecks.forEach(deck => expect(deck).toBe(true));
});

test('Should contain no duplicate cards', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleDeck(newDeck())
  ];

  // Then
  const duplicates = decks.map(deck => new Set(deck).size !== deck.length)
  duplicates.forEach((deck) => expect(deck).toBe(false))
});

/** 
 * DECK DEALING REQUIREMENTS
 * - Should shuffle all items
 * - Should always deal from a deck of 60 cards
 * - Should deal exactly 10 cards per player
 * - Should have exactly amount of players X 10 cards subtracted from the main deck after dealing
 *  - Should have a restraint of a max of 4 players
 */

test('Should return the same deck shuffled', () => {
  // Given
  const decks = {
    unshuffled: newDeck(),
    shuffled: shuffleDeck(newDeck())
  };

  expect(decks['shufffled']).not.toBe(decks['unshuffled']);
});

test('Should always deal with a deck of 60 cards', () => {
  // Given
  const emptyDeck = [];
  const deck = dealCards(emptyDeck, 2);

  // Then 
  const mainDeckLength = deck.remainingCards.length;
  const player1CardsLength = deck.players['1'].length;
  const player2CardsLength = deck.players['2'].length;
  const totalSum = mainDeckLength + player1CardsLength + player2CardsLength;
  expect(totalSum).toBe(60)
});

test('Should deal exactly 10 cards to each player', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());
  const numberOfPlayers = 2;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  for (i = 1; i < numberOfPlayers; i++) {
    expect(dealtCards.players[i].length).toBe(10)
  }
});

test('Should contain a main deck where the (amount of players X 10) is subtracted', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());
  const mainDeckLength = mainDeck.length;
  const numberOfPlayers = 3;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  expect(dealtCards.remainingCards.length).toBe(mainDeckLength - (numberOfPlayers * 10))
});

test('Should throw error if there are more than 4 players', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());
  const numberOfPlayers = 5;

  // Then
  expect(() => {
    dealCards(mainDeck, numberOfPlayers)
  }).toThrowError('Cannot exceed amount of 4 players')
});

/**
 * GAME REQUIREMENTS
 * - Should only show selected player's cards
 * - Should throw error if player's hand is empty
 * - Should only show top card of discard pile
 * - Should throw error if discard pile is empty
 * - Should reshuffle discard pile if main deck is empty
 * - Should throw error if attempting to reshuffle when main deck is not empty
 * - Should be able to select only the top card from either discard pile or main deck
 * 
 * - Should be able to select a max of one card from current players hand
 * - Should be able to swap both selected cards
 * - Should only allow one turn at a time per player
 */

test('Should only show selected player\'s cards', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());
  const dealtCards = dealCards(mainDeck, 2);
  const playerId = 1;

  // When
  const cards = showPlayersCards(dealtCards, playerId);

  // Then
  expect(cards).toBe(dealtCards.players[playerId]);
});

test('Should throw error if player\s hand is empty', () => {
  const gameCards = {
    remainingCards: [1, 2, 3, 4],
    players: {
      "1": [],
      "2": []
    }
  };
  const playerId = 1;

  expect(() => {
    showPlayersCards(gameCards, playerId)
  }).toThrowError('Cannot display zero cards');
});

test('Should throw error if discard pile is empty', () => {
  // Given
  const gameCards = {
    discardPile: []
  };

  // Then
  expect(() => {
    showDiscardPile(gameCards)
  }).toThrowError('Discard pile cannot be empty')
});

test('Should throw error if main deck is not empty when attempting to reshuffle', () => {
  // Given
  const gameCards = {
    remainingCards: [1, 2, 3],
    discardPile: [4, 5, 6]
  };

  // Then
  expect(() => {
    reshuffleDiscardPile(gameCards)
  }).toThrowError('Main deck needs to be empty for a reshuffle')
});

test('Should throw error if discard pile is empty when attempting to reshuffle', () => {
  // Given
  const gameCards = {
    remainingCards: [],
    discardPile: []
  };

  // Then
  expect(() => {
    reshuffleDiscardPile(gameCards)
  }).toThrowError('Cannot reshuffle empty discard pile')
});

test('Should reshuffle all cards from discard pile except the top card', () => {
  // Given
  const remainingCards = [];
  const discardPile = [12, 52, 13, 42, 55, 26, 17, 48];

  // When
  const reshuffledDeck = reshuffleDiscardPile({ remainingCards, discardPile });

  // Then
  expect(reshuffledDeck.discardPile).toEqual(expect.arrayContaining([discardPile[0]]));
});

test('Should reshuffle all cards from discard pile to main deck', () => {
  // Given
  const remainingCards = [];
  const discardPile = [12, 52, 13, 42, 55, 26, 17, 48];
  const updatedDiscardPile = discardPile.slice(1, discardPile.length)

  // When
  const reshuffledDeck = reshuffleDiscardPile({ remainingCards, discardPile });

  // Then
  expect(reshuffledDeck.remainingCards).toStrictEqual(expect.arrayContaining(updatedDiscardPile));
});

test('Should only show top card card of discard pile', () => {
  // Given
  const gameCards = {
    discardPile: [1, 2, 3]
  };

  // When
  const discardCard = showDiscardPile(gameCards);

  // Then
  expect(discardCard).toBe(gameCards.discardPile[0]);
});

test('Should select only top card of discard pile', () => {
  // Given
  const discardPile = [1, 2, 3];

  // When
  const discardCard = selectCardFromDiscardPile({ discardPile });

  // Then
  expect(discardCard).toStrictEqual([discardPile[0]]);
});

// test('Should select one card from current player\'s hand', () => { });
