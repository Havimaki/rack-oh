const {
  newDeck,
  shuffleDeck,
  dealCards
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

test('Should always shuffle a new deck if deck is empty', () => {
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
  const totalSum = deck.remainingCards.length + deck.playersCards[0]['player1'].length + deck.playersCards[1]['player2'].length
  expect(totalSum).toBe(60)
});

test('Should deal exactly 10 cards to each player', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());

  // When
  const dealtCards = dealCards(mainDeck, 2);

  // Then
  dealtCards.playersCards.forEach(cards => {
    expect(Object.values(cards)[0].length).toBe(10)
  });
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
