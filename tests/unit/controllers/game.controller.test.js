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
  isRackOh,
  checkForRackOh,
} = require('@controllers/game.controller');


// ===============  MODULE FUNCTIONS

describe('createGame', () => { });
describe('playMove', () => { });

// ===============  HELPER FUNCTIONS

describe('game setup', () => {
  const players = ["Danielle", "Rando"];
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

    // Then
    expect(() => {
      shuffleCards(emptyDeck)
    }).toThrowError('There must be at least 2 cards to shuffle')
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

  test('Should return the same deck shuffled', () => {
    // Given
    const decks = {
      unshuffled: newDeck(),
      shuffled: shuffleCards(newDeck())
    };

    expect(decks['shufffled']).not.toBe(decks['unshuffled']);
  });

  test('Should always deal a deck of cars with no duplicates between the main deck and discard pile', async () => {
    // Given
    const deck = shuffleCards(newDeck());

    // When
    const gameCards = await dealCards(deck, players);

    // Then
    const checkForDuplicates = gameCards.mainDeck.filter(deckCard => {
      return gameCards.discardPile.find(discardCard => discardCard == deckCard)
    }).length > 0;
    expect(checkForDuplicates).toBe(false);
  });

  test('Should always deal with a deck of 60 cards', async () => {
    // Given
    const emptyDeck = [];
    const deck = await dealCards(emptyDeck, players);

    // Then 
    const mainDeck = deck.mainDeck.length;
    const discardPile = deck.discardPile.length;
    const playerOne = deck.players['Danielle'].length;
    const playerTwo = deck.players['Rando'].length;
    const totalSum = mainDeck + discardPile + playerOne + playerTwo;
    expect(totalSum).toBe(60)
  });

  test('Should deal exactly 10 cards to each player', async () => {
    // Given 
    const mainDeck = shuffleCards(newDeck());

    // When
    const dealtCards = await dealCards(mainDeck, players);

    // Then
    players.forEach((player) => {
      expect(dealtCards.players[player].length).toBe(10)
    })
  });

  test('Should deal and return with 1 card in discard pile', async () => {
    // Given 
    const mainDeck = shuffleCards(newDeck());

    // When
    const dealtCards = await dealCards(mainDeck, players);

    // Then
    expect(dealtCards.discardPile.length).toBe(1);
  });

  test('Should contain a main deck where the (amount of players X 10) is subtracted', async () => {
    // Given 
    const mainDeck = shuffleCards(newDeck());
    const mainDeckLength = mainDeck.length;
    const threePlayers = [...players, 'Rando2'];

    // When
    const dealtCards = await dealCards(mainDeck, threePlayers);

    // Then
    expect(dealtCards.mainDeck.length).toBe(mainDeckLength - dealtCards.discardPile.length - (threePlayers.length * 10))
  });

  test('Should throw error if there are more than 4 players', async () => {
    // Given 
    const mainDeck = shuffleCards(newDeck());
    const fivePlayers = [...players, 'rando2', 'rando3', 'rando4'];

    // Then
    await expect(dealCards(mainDeck, fivePlayers)).rejects.toThrow('Cannot exceed amount of 4 players')
  });

  test('Should throw error if there are no players', async () => {
    // Given 
    const mainDeck = shuffleCards(newDeck());

    // Then
    await expect(dealCards(mainDeck, [])).rejects.toThrow('There must be at least 2 players')
  });

});

describe('player moves', () => {
  const players = ["Danielle", "Rando"];

  describe('show card functions', () => {
    test('Should only show selected player\'s cards', async () => {
      // Given 
      const mainDeck = shuffleCards(newDeck());
      const dealtCards = await dealCards(mainDeck, players);
      const playerName = players[0];
      // When
      const cards = showPlayersHand(dealtCards, playerName);

      // Then
      expect(cards).toBe(dealtCards.players[playerName]);
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

    test('Should throw  error if playerId is not passed in', async () => {
      // Given 
      const mainDeck = shuffleCards(newDeck());
      const dealtCards = await dealCards(mainDeck, players);
      const playerId = null;

      // Then
      expect(() => {
        showPlayersHand(dealtCards, playerId);
      }).toThrowError('playerId cannot be undefined')
    });
  });

  describe('select card functions', () => {
    test('Should select one card from current player\'s hand', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])

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

    test('Should throw error if more than one selected card passed in', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])

      // Then
      expect(() => {
        selectCardFromHand(currentHand, [currentHand[0], currentHand[1]]);
      }).toThrowError('Selected card must be an integer');

      expect(() => {
        selectCardFromHand(currentHand, 0.4);
      }).toThrowError('Selected card must be an integer');
    });

    test('Should select top card of main deck', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const topCard = gameCards.mainDeck[0];

      // When
      const selectedCard = selectCardFromMainDeck(gameCards);

      // Then
      expect(selectedCard).toBe(topCard)
    });

    test('Should select top card of discard pile', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const topDiscardCard = gameCards.discardPile[0];

      // When
      const selectedCard = selectCardFromDiscardPile(gameCards);

      // Then
      expect(selectedCard).toBe(topDiscardCard)
    });
    test('Should throw error if discard pile is empty', () => {
      // Given
      const gameCards = {
        discardPile: []
      }

      // Then
      expect(() => {
        selectCardFromDiscardPile(gameCards);
      }).toThrowError('Discard pile cannot be empty');
    });

    test('Should throw error if main deck is empty', () => {
      // Given
      const gameCards = {
        mainDeck: []
      }

      // Then
      expect(() => {
        selectCardFromMainDeck(gameCards);
      }).toThrowError('Main deck cannot be empty');
    });

    test('Should throw error if selected card not passed in', () => {
      // Given
      const currentHand = [1, 2, 3];
      const selectedCard = null;

      // Then
      expect(() => {
        selectCardFromHand(currentHand, selectedCard);
      }).toThrowError('Selected card must be passed in');
    });

    // TODO:
    test('Should throw error if selectedCard not passed in', () => { });
  })

  describe('swap card functions', () => {
    test('Should swap selected card from current hand with selected card from deck', async () => {
      //  Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayersHand(gameCards, playerName)

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      const checkForSwappedCard = swappedCards.players[playerName].filter(card => card == selectedMainDeckCard).length > 0
      expect(checkForSwappedCard).toBe(true);
    });

    test('Should reshuffle discard pile if main deck is empty after swaping a card', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const cutDeck = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
      gameCards.discardPile = gameCards.discardPile.concat(cutDeck);
      const discardPileLength = gameCards.discardPile.length;
      const currentHand = showPlayersHand(gameCards, players[0])

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(gameCards.mainDeck.length).toBe(discardPileLength)
    });

    test('Should maintain 10 cards in current hand after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayersHand(gameCards, playerName)

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.players[playerName].length).toBe(10);
    });

    test('Should increase discard pile by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])
      const discardPileLength = gameCards.discardPile.length;

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.discardPile.length).toBe(discardPileLength + 1);
    });

    test('Should decrease main deck by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])
      const mainDeckLength = gameCards.mainDeck.length;

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.mainDeck.length).toBe(mainDeckLength - 1);
    });

    test('Should return winner after swapping cards if player played winning hand', () => {
      //  Given
      const playerId = 1;
      const gameCards = {
        players: {
          "1": [60, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          "2": [59, 58, 57, 56, 55, 54, 53, 52, 51, 50]
        },
        mainDeck: [11, 12, 13, 14, 15],
        discardPile: [16, 17, 18, 19, 20]
      }
      const selectedHandCard = selectCardFromHand(gameCards.players[playerId], gameCards.players[playerId][0]);
      const selectedMainDeckCard = 1;

      // When
      const game = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(game.winner).toBe(playerId);
    });
    test('Should swap selected card from current hand with selected card from deck', async () => {
      //  Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayersHand(gameCards, playerName)

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      const checkForSwappedCard = swappedCards.players[playerName].filter(card => card == selectedMainDeckCard).length > 0
      expect(checkForSwappedCard).toBe(true);
    });

    test('Should reshuffle discard pile if main deck is empty after swaping a card', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const cutDeck = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
      gameCards.discardPile = gameCards.discardPile.concat(cutDeck);
      const discardPileLength = gameCards.discardPile.length;
      const currentHand = showPlayersHand(gameCards, players[0])

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(gameCards.mainDeck.length).toBe(discardPileLength)
    });

    test('Should maintain 10 cards in current hand after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayersHand(gameCards, playerName)

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.players[playerName].length).toBe(10);
    });

    test('Should increase discard pile by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])
      const discardPileLength = gameCards.discardPile.length;

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.discardPile.length).toBe(discardPileLength + 1);
    });

    test('Should decrease main deck by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayersHand(gameCards, players[0])
      const mainDeckLength = gameCards.mainDeck.length;

      const selectedHandCard = selectCardFromHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.mainDeck.length).toBe(mainDeckLength - 1);
    });

    test('Should return winner after swapping cards if player played winning hand', () => {
      //  Given
      const playerId = 1;
      const gameCards = {
        players: {
          "1": [60, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          "2": [59, 58, 57, 56, 55, 54, 53, 52, 51, 50]
        },
        mainDeck: [11, 12, 13, 14, 15],
        discardPile: [16, 17, 18, 19, 20]
      }
      const selectedHandCard = selectCardFromHand(gameCards.players[playerId], gameCards.players[playerId][0]);
      const selectedMainDeckCard = 1;

      // When
      const game = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(game.winner).toBe(playerId);
    });

    // TODO:
    test('Should throw error if attempting to reshuffle when main deck is not empty ', () => { });
    test('Should throw error if playerId is not passed in when swapping ', () => { });
    test('Should throw error if selectedHandCard is not passed in when swapping', () => { });
    test('Should throw error if selectedDeckCard is not passed in when swapping ', () => { });
  });
});

describe('game functions', () => {
  describe('shuffling ', () => {
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
  });

  describe('game end functions', () => {
    test('Should announce rack-oh for winner', () => {
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

    test('Should not announce rack-oh for winner', () => {
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

    test('Should return playerId if player won', () => {
      // Given
      const playerId = 1;
      const gameCards = {
        players: {
          "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          "2": [59, 58, 57, 56, 49, 48, 47, 46, 39, 38]
        }
      }

      // When
      const winner = checkForRackOh(gameCards, playerId);

      // Then
      expect(winner).toBe(playerId);
    });

    test('Should throw error if playerId is not passed in when checking for winner', () => {
      // Given
      const playerId = null;
      const gameCards = {
        players: {
          "1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          "2": [59, 58, 57, 56, 49, 48, 47, 46, 39, 38]
        }
      }

      // When
      expect(() => {
        checkForRackOh(gameCards, playerId);
      }).toThrowError('playerId cannot be undefined')
    });
  });
});

describe('game requirements', () => {
  // TODO:
  test('should only allow one turn at a time per player', () => { });
  test('should shuffle when 1 card remaining in main deck', () => { });
})

