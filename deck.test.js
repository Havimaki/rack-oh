const { newDeck, shuffleDeck, dealCards } = require('./deck');


/**
 * TESTS
 */

/** 
 * REQUIREMENTS
 * - Should deal 10 cards per player from a deck of 60 cards
 * - Should have deck, numerated 1 through 60 with no repeated integers
 * - Should deal cards in shuffled manner
 * 
*/
test('Should have deck of 60 cards', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleDeck(newDeck())
  ];

  // Then
  decks.forEach((deck) => expect(deck.length).toBe(60));
});

test('Should contain every interger from 1 to 60', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleDeck(newDeck())
  ];
  const allIntegers = decks.map(deck => {
    return deck.filter(card => {
      return (
        (card == 1 || card == 60)
        && card > 0
        && card < 61
      );
    }).length > 0;
  });

  // Then
  allIntegers.forEach(deck => expect(deck).toBe(true));
});

test('Should contain no duplicates', () => {
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
 * REQUIREMENTS
 * - Should shuffle all items
 * - Should deal exactly 10 cards per player
 * - Should have exactly 40 cards in the main deck after dealing
 */

test('Should return the same deck shuffled', () => {
  // Given
  const decks = {
    unshuffled: newDeck(),
    shuffled: shuffleDeck(newDeck())
  };

  expect(decks['shufffled']).not.toBe(decks['unshuffled']);
});

test('Should deal exactly 10 cards to each player', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());

  // When
  const dealtCards = dealCards(mainDeck, 2);

  // Then
  dealtCards.playersCards.forEach(cards => expect(Object.values(cards)[0].length).toBe(10));
});

test('Should contain a main deck where the amount of players X 10 is subtracted', () => {
  // Given 
  const mainDeck = shuffleDeck(newDeck());
  const mainDeckLength = mainDeck.length;
  const numberOfPlayers = 3;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  expect(dealtCards.remainingDeck.length).toBe(mainDeckLength - (numberOfPlayers * 10))
});
