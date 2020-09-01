const {
  newDeck,
  shuffleCards,
  reshuffleDiscardPile,
  dealCards,
  showDiscardPile,
  showPlayersHand,
  selectCardFromDiscardPile,
  selectCardFromHand,
  selectCardFromMainDeck,
  swapCards,
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
    shuffleCards(newDeck())
  ];

  // Then
  decks.forEach((deck) => expect(deck.length).toBe(60));
});

test('Should always shuffle a new deck if deck is empty or no deck if passed in', () => {
  // Given
  const emptyDeck = [];
  const deck = shuffleCards(emptyDeck);

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
  const deck = shuffleCards(postShuffle);

  // Then 
  expect(deck).not.toBe(preShuffle)
});

test('Should always have a deck that contains every interger from 1 to 60', () => {
  // Given
  const decks = [
    newDeck(),
    shuffleCards(newDeck())
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
    shuffleCards(newDeck())
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
    shuffled: shuffleCards(newDeck())
  };

  expect(decks['shufffled']).not.toBe(decks['unshuffled']);
});

test('Should always deal a deck of cars with no duplicates between the main deck and discard pile', () => {
  // Given
  const deck = shuffleCards(newDeck());

  // When
  const gameCards = dealCards(deck, 2);

  // Then
  const checkForDuplicates = gameCards.mainDeck.filter(deckCard => {
    return gameCards.discardPile.find(discardCard => discardCard == deckCard)
  }).length > 0;
  expect(checkForDuplicates).toBe(false);
});

test('Should always deal with a deck of 60 cards', () => {
  // Given
  const emptyDeck = [];
  const deck = dealCards(emptyDeck, 2);

  // Then 
  const mainDeck = deck.mainDeck.length;
  const discardPile = deck.discardPile.length;
  const playerOne = deck.players['1'].length;
  const playerTow = deck.players['2'].length;
  const totalSum = mainDeck + discardPile + playerOne + playerTow;
  expect(totalSum).toBe(60)
});

test('Should deal exactly 10 cards to each player', () => {
  // Given 
  const mainDeck = shuffleCards(newDeck());
  const numberOfPlayers = 2;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  for (i = 1; i < numberOfPlayers; i++) {
    expect(dealtCards.players[i].length).toBe(10)
  }
});

test('Should always deal with 1 card in discard pile', () => {
  // Given 
  const mainDeck = shuffleCards(newDeck());
  const numberOfPlayers = 2;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  expect(dealtCards.discardPile.length).toBe(1);
});

test('Should contain a main deck where the (amount of players X 10) is subtracted', () => {
  // Given 
  const mainDeck = shuffleCards(newDeck());
  const mainDeckLength = mainDeck.length;
  const numberOfPlayers = 3;

  // When
  const dealtCards = dealCards(mainDeck, numberOfPlayers);

  // Then
  expect(dealtCards.mainDeck.length).toBe(mainDeckLength - dealtCards.discardPile.length - (numberOfPlayers * 10))
});

test('Should throw error if there are more than 4 players', () => {
  // Given 
  const mainDeck = shuffleCards(newDeck());
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
  const mainDeck = shuffleCards(newDeck());
  const dealtCards = dealCards(mainDeck, 2);
  const playerId = 1;

  // When
  const cards = showPlayersHand(dealtCards, playerId);

  // Then
  expect(cards).toBe(dealtCards.players[playerId]);
});

test('Should throw error if player\s hand is empty', () => {
  const gameCards = {
    mainDeck: [1, 2, 3, 4],
    players: {
      "1": [],
      "2": []
    }
  };
  const playerId = 1;

  expect(() => {
    showPlayersHand(gameCards, playerId)
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
    mainDeck: [1, 2, 3],
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
    mainDeck: [],
    discardPile: []
  };

  // Then
  expect(() => {
    reshuffleDiscardPile(gameCards)
  }).toThrowError('Cannot reshuffle empty discard pile')
});

test('Should reshuffle all cards from discard pile except the top card', () => {
  // Given
  const mainDeck = [];
  const discardPile = [12, 52, 13, 42, 55, 26, 17, 48];

  // When
  const reshuffledDeck = reshuffleDiscardPile({ mainDeck, discardPile });

  // Then
  expect(reshuffledDeck.discardPile).toEqual(expect.arrayContaining([discardPile[0]]));
});

test('Should reshuffle all cards from discard pile to main deck', () => {
  // Given
  const mainDeck = [];
  const discardPile = [12, 52, 13, 42, 55, 26, 17, 48];
  const updatedDiscardPile = discardPile.slice(1, discardPile.length)

  // When
  const reshuffledDeck = reshuffleDiscardPile({ mainDeck, discardPile });

  // Then
  expect(reshuffledDeck.mainDeck).toStrictEqual(expect.arrayContaining(updatedDiscardPile));
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

/**
 * PLAY REQUIREMENTS
 * - Should select one card from current player\'s hand
 * - Should throw error if current player's hand is empty
 * - Should be able to select a max of one card from current players hand
 * - Should be able to swap both selected cards
 * - Should only allow one turn at a time per player
 */

test('Should select one card from current player\'s hand', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)

  // When
  const selectedCard = selectCardFromHand(currentHand, currentHand[1]);

  // Then
  expect(selectedCard).toBe(currentHand[1])
});


test('Should throw error if current player\'s hand is empty', () => {
  // Given
  const currentHand = [];
  const selectedCard = 1;

  // Then
  expect(() => {
    selectCardFromHand(currentHand, selectedCard)
  }).toThrowError('Current player\'s hand cannot be empty');
});

test('Should throw error if more than one selected card passed in', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)

  // Then
  expect(() => {
    selectCardFromHand(currentHand, [currentHand[0], currentHand[1]]);
  }).toThrowError('Selected card must be an integer');

  expect(() => {
    selectCardFromHand(currentHand, 0.4);
  }).toThrowError('Selected card must be an integer');
});

test('Should select top card of main deck', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const topCard = gameCards.mainDeck[0];

  // When
  const selectedCard = selectCardFromMainDeck(gameCards);

  // Then
  expect(selectedCard).toBe(topCard)
});

test('Should select top card of discard pile', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const topDiscardCard = [gameCards.discardPile[0]];

  // When
  const selectedCard = selectCardFromDiscardPile(gameCards);

  // Then
  expect(selectedCard).toStrictEqual(topDiscardCard)
});

test('Should swap selected card from current hand with selected card from deck', () => {
  //  Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)

  const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
  const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

  // When
  const swappedCards = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

  // Then
  const checkForSwappedCard = swappedCards.players[playerId].filter(card => card == selectedMainDeckCard).length > 0
  expect(checkForSwappedCard).toBe(true);
});

test('Should reshuffle discard pile if main deck is empty after swaping a card', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const cutDeck = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
  gameCards.discardPile = gameCards.discardPile.concat(cutDeck);
  const discardPileLength = gameCards.discardPile.length;
  const currentHand = showPlayersHand(gameCards, playerId)

  const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
  const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

  // When
  swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

  // Then
  expect(gameCards.mainDeck.length).toBe(discardPileLength)
});

test('Should maintain 10 cards in current hand after swapping cards', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)

  const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
  const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

  // When
  const swappedCards = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

  // Then
  expect(swappedCards.players[playerId].length).toBe(10);
});

test('Should increase discard pile by 1 card after swapping cards', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)
  const discardPileLength = gameCards.discardPile.length;

  const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
  const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

  // When
  const swappedCards = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

  // Then
  expect(swappedCards.discardPile.length).toBe(discardPileLength + 1);
});

test('Should decrease main deck by 1 card after swapping cards', () => {
  // Given
  const deck = shuffleCards(newDeck());
  const gameCards = dealCards(deck, 2);
  const playerId = 1;
  const currentHand = showPlayersHand(gameCards, playerId)
  const mainDeckLength = gameCards.mainDeck.length;

  const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
  const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

  // When
  const swappedCards = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

  // Then
  expect(swappedCards.mainDeck.length).toBe(mainDeckLength - 1);
});

