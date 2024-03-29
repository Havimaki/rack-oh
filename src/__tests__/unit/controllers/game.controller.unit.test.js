// =============== IMPORTS
const {
  gameController: {
    shuffleCards,
    isRackOh,
    checkForRackOh,
  },
  deckController: {
    createDeck,
    createBoard,
  },
} = require('@controllers');

// ===============  MODULE FUNCTIONS

describe('createGame', () => { });

// ===============  HELPER FUNCTIONS


const players = ["Danielle", "Rando"];
const deck = shuffleCards(createDeck());
describe('createDeck', () => {
  it('Should deal a deck of 60 cards', () => {
    // Given
    const decks = [
      createDeck(),
      shuffleCards(createDeck())
    ];

    // Then
    decks.forEach((deck) => expect(deck.length).toBe(60));
  });

  it('Should always have a deck that contains every interger from 1 to 60', () => {
    // Given
    const decks = [
      createDeck(),
      shuffleCards(createDeck())
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

  it('Should contain no duplicate cards', () => {
    // Given
    const decks = [
      createDeck(),
      shuffleCards(createDeck())
    ];

    // Then
    const duplicates = decks.map(deck => new Set(deck).size !== deck.length)
    duplicates.forEach((deck) => expect(deck).toBe(false))
  });

  it('Should return the same deck shuffled', () => {
    // Given
    const decks = {
      unshuffled: createDeck(),
      shuffled: shuffleCards(createDeck())
    };

    expect(decks['shufffled']).not.toBe(decks['unshuffled']);
  });

});

describe('shuffleCards', () => {
  it('Should always shuffle a new deck if deck is empty or no deck if passed in', () => {
    // Given
    const emptyDeck = [];

    // Then
    expect(() => {
      shuffleCards(emptyDeck)
    }).toThrowError('There must be at least 2 cards to shuffle')
  });

  it('Should always shuffle discard deck with only the deck items passed in', () => {
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
});

describe('createBoard', () => {
  xit('Should always deal a deck of cars with no duplicates between the main deck and discard pile', async () => {
    // Given
    // When
    const gameCards = await createBoard(deck, players);

    // Then
    const checkForDuplicates = gameCards.mainDeck.filter(deckCard => {
      return gameCards.discardPile.find(discardCard => discardCard == deckCard)
    }).length > 0;
    expect(checkForDuplicates).toBe(false);
  });

  xit('Should always deal with a deck of 60 cards', async () => {
    // Given
    const emptyDeck = [];
    const deck = await createBoard(emptyDeck, players);

    // Then 
    const mainDeck = deck.mainDeck.length;
    const discardPile = deck.discardPile.length;
    const playerOne = deck.players['Danielle'].length;
    const playerTwo = deck.players['Rando'].length;
    const totalSum = mainDeck + discardPile + playerOne + playerTwo;
    expect(totalSum).toBe(60)
  });

  xit('Should deal exactly 10 cards to each player', async () => {
    // Given 
    // When
    const dealtCards = await createBoard(deck, players);

    // Then
    players.forEach((player) => {
      expect(dealtCards.players[player].length).toBe(10)
    })
  });

  xit('Should deal and return with 1 card in discard pile', async () => {
    // Given 
    // When
    const dealtCards = await createBoard(deck, players);

    // Then
    expect(dealtCards.discardPile.length).toBe(1);
  });

  xit('Should contain a main deck where the (amount of players X 10) is subtracted', async () => {
    // Given 
    const mainDeckLength = deck.length;
    const threePlayers = [...players, 'Rando2'];

    // When
    const dealtCards = await createBoard(deck, threePlayers);

    // Then
    expect(dealtCards.deck.length).toBe(mainDeckLength - dealtCards.discardPile.length - (threePlayers.length * 10))
  });

  it('Should throw error if there are more than 4 players', async () => {
    // Given 
    const fivePlayers = [...players, 'rando2', 'rando3', 'rando4'];

    // Then
    await expect(createBoard(deck, fivePlayers)).rejects.toThrow('Cannot exceed amount of 4 players')
  });

  it('Should throw error if there are no players', async () => {
    // Given 
    const mainDeck = shuffleCards(createDeck());

    // Then
    await expect(createBoard(mainDeck, [])).rejects.toThrow('There must be at least 2 players')
  });

});

describe('checkForRackOh', () => {
  it('Should return true if hand is in increrasing order', () => {
    // Given
    const hand = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // When
    const res = checkForRackOh(hand);

    // Then
    expect(res).toBe(true);
  });

  it('Should return false if hand is not in increrasing order', () => {
    // Given
    const hand = [1, 2, 3, 4, 5, 6, 7, 8, 10, 9];

    // When
    const res = checkForRackOh(hand);

    // Then
    expect(res).toBe(false);
  });


});

describe('isRackoh', () => {
  it('Should announce rack-oh for winner', () => {
    // Given
    const playerId = 1;
    const gameCards = {
      players: {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "2": [59, 58, 57, 56, 49, 48, 47, 46, 39, 38]
      }
    }

    // When
    const checkForRackOh = isRackOh(gameCards, playerId);

    // Then
    expect(checkForRackOh).toBe(true)
  });

  it('Should not announce rack-oh for winner', () => {
    // Given
    const playerId = 2;
    const gameCards = {
      players: {
        "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "2": [59, 58, 57, 56, 49, 48, 47, 46, 39, 38]
      }
    }

    // When
    const checkForRackOh = isRackOh(gameCards, playerId);

    // Then
    expect(checkForRackOh).toBe(false)
  });

});

describe('game requirements', () => {
  // TODO:
  it('should only allow one turn at a time per player', () => { });
  it('should shuffle when 1 card remaining in main deck', () => { });
})

