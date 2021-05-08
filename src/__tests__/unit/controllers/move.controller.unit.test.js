// =============== IMPORTS
const {
  redisConstants: {
    PLAYER,
  },
} = require('@constants');
const {
  gameController: {
    newDeck,
    shuffleCards,
    dealCards,
  },
  moveController: {
    reshuffleDiscardPile,
    showDiscardPile,
    showPlayerHand,
    selectCardFromDiscardPile,
    selectCardFromPlayerHand,
    selectCardFromMainDeck,
    swapCards,
  }
} = require('@controllers');

// ===============  MODULE FUNCTIONS


// ===============  HELPER FUNCTIONS
describe('player moves', () => {
  const players = ["Danielle", "Rando"];
  const mainDeck = shuffleCards(newDeck());

  describe('show card functions', () => {
    // FIX
    xit('Should only show selected player\'s cards', async () => {
      // Given
      const gameCards = await dealCards(mainDeck, players);
      const player = players[0];
      const playerName = `${PLAYER}${player}`;

      // When
      const cards = showPlayerHand(gameCards, player);

      // Then
      expect(cards).toBe(gameCards[playerName]);
    });

    // INCORRECT
    xit('Should throw error if player\s hand is empty', () => {
      const gameCards = {
        mainDeck: [1, 2, 3, 4],
        '{PLAYER}:Danielle': [],
      };

      expect(() => {
        showPlayerHand(gameCards, players[0])
      }).toThrowError('Hand cannot be empty');
    });

    // INCORRECT
    xit('Should throw error if discard pile is empty', () => {
      // Given
      const gameCards = {
        discardPile: []
      };

      // Then
      expect(() => {
        showDiscardPile(gameCards)
      }).toThrowError('Discard pile cannot be empty')
    });

    // FIX
    xit('Should only show top card card of discard pile', async () => {
      // Given
      const gameCards = {
        discardPile: [1, 2, 3]
      };

      // When
      const discardCard = await showDiscardPile(gameCards);

      // Then
      expect(discardCard).toBe(gameCards.discardPile[0]);
    });

    // INCORRECT
    xit('Should throw  error if playerId is not passed in', async () => {
      // Given 
      const dealtCards = await dealCards(mainDeck, players);
      const playerId = null;

      // Then
      await expect(() => {
        showPlayerHand(dealtCards, playerId);
      }).toThrowError('playerId cannot be undefined')
    });
  });

  describe('select card functions', () => {
    xit('Should select one card from current player\'s hand', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = await showPlayerHand(gameCards, players[0])

      // When
      const selectedCard = selectCardFromPlayerHand(currentHand, currentHand[0]);

      // Then
      expect(selectedCard).toBe(currentHand[1])
    });

    xit('Should throw error if current player\'s hand is empty', () => {
      // Given
      const currentHand = [];
      const selectedCard = 1;

      // Then
      expect(() => {
        selectCardFromPlayerHand(currentHand, selectedCard)
      }).toThrowError('Current player\'s hand cannot be empty');
    });

    xit('Should throw error if more than one selected card passed in', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayerHand(gameCards, players[0])

      // Then
      expect(() => {
        selectCardFromPlayerHand(currentHand, [currentHand[0], currentHand[1]]);
      }).toThrowError('Selected card must be an integer');

      expect(() => {
        selectCardFromPlayerHand(currentHand, 0.4);
      }).toThrowError('Selected card must be an integer');
    });

    xit('Should select top card of main deck', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const topCard = gameCards.mainDeck[0];

      // When
      const selectedCard = selectCardFromMainDeck(gameCards);

      // Then
      expect(selectedCard).toBe(topCard)
    });

    xit('Should select top card of discard pile', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const topDiscardCard = gameCards.discardPile[0];

      // When
      const selectedCard = selectCardFromDiscardPile(gameCards);

      // Then
      expect(selectedCard).toBe(topDiscardCard)
    });

    xit('Should throw error if discard pile is empty', () => {
      // Given
      const gameCards = {
        discardPile: []
      }

      // Then
      expect(() => {
        selectCardFromDiscardPile(gameCards);
      }).toThrowError('Discard pile cannot be empty');
    });

    xit('Should throw error if main deck is empty', () => {
      // Given
      const gameCards = {
        mainDeck: []
      }

      // Then
      expect(() => {
        selectCardFromMainDeck(gameCards);
      }).toThrowError('Main deck cannot be empty');
    });

    xit('Should throw error if selected card not passed in', () => {
      // Given
      const currentHand = [1, 2, 3];
      const selectedCard = null;

      // Then
      expect(() => {
        selectCardFromPlayerHand(currentHand, selectedCard);
      }).toThrowError('Selected card must be passed in');
    });

    // TODO:
    xit('Should throw error if selectedCard not passed in', () => { });
  })

  describe('swap card functions', () => {
    xit('Should swap selected card from current hand with selected card from deck', async () => {
      //  Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = await showPlayerHand(gameCards, playerName)

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = await swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      const checkForSwappedCard = swappedCards.players[playerName].filter(card => card == selectedMainDeckCard).length > 0
      expect(checkForSwappedCard).toBe(true);
    });

    xit('Should reshuffle discard pile if main deck is empty after swaping a card', async () => {
      // Given
      const deck = await shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const cutDeck = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
      gameCards.discardPile = gameCards.discardPile.concat(cutDeck);
      const discardPileLength = gameCards.discardPile.length;
      const currentHand = await showPlayerHand(gameCards, players[0])

      const selectedHandCard = await selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = await selectCardFromMainDeck(gameCards);

      // When
      swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(gameCards.mainDeck.length).toBe(discardPileLength)
    });

    xit('Should maintain 10 cards in current hand after swapping cards', async () => {
      // Given
      const deck = await shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = await showPlayerHand(gameCards, playerName)

      const selectedHandCard = await selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = await selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = await swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.players[playerName].length).toBe(10);
    });

    xit('Should increase discard pile by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayerHand(gameCards, players[0])
      const discardPileLength = gameCards.discardPile.length;

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = await swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.discardPile.length).toBe(discardPileLength + 1);
    });

    xit('Should decrease main deck by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = await showPlayerHand(gameCards, players[0])
      const mainDeckLength = gameCards.mainDeck.length;

      const selectedHandCard = await selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = await selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = await swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.mainDeck.length).toBe(mainDeckLength - 1);
    });

    xit('Should return winner after swapping cards if player played winning hand', () => {
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
      const selectedHandCard = selectCardFromPlayerHand(gameCards.players[playerId], gameCards.players[playerId][0]);
      const selectedMainDeckCard = 1;

      // When
      const game = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(game.winner).toBe(playerId);
    });

    xit('Should swap selected card from current hand with selected card from deck', async () => {
      //  Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayerHand(gameCards, playerName)

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      const checkForSwappedCard = swappedCards.players[playerName].filter(card => card == selectedMainDeckCard).length > 0
      expect(checkForSwappedCard).toBe(true);
    });

    xit('Should reshuffle discard pile if main deck is empty after swaping a card', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const cutDeck = gameCards.mainDeck.splice(1, gameCards.mainDeck.length);
      gameCards.discardPile = gameCards.discardPile.concat(cutDeck);
      const discardPileLength = gameCards.discardPile.length;
      const currentHand = showPlayerHand(gameCards, players[0])

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(gameCards.mainDeck.length).toBe(discardPileLength)
    });

    xit('Should maintain 10 cards in current hand after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const playerName = players[0];
      const currentHand = showPlayerHand(gameCards, playerName)

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, playerName, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.players[playerName].length).toBe(10);
    });

    xit('Should increase discard pile by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayerHand(gameCards, players[0])
      const discardPileLength = gameCards.discardPile.length;

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.discardPile.length).toBe(discardPileLength + 1);
    });

    xit('Should decrease main deck by 1 card after swapping cards', async () => {
      // Given
      const deck = shuffleCards(newDeck());
      const gameCards = await dealCards(deck, players);
      const currentHand = showPlayerHand(gameCards, players[0])
      const mainDeckLength = gameCards.mainDeck.length;

      const selectedHandCard = selectCardFromPlayerHand(currentHand, currentHand[1]);
      const selectedMainDeckCard = selectCardFromMainDeck(gameCards);

      // When
      const swappedCards = swapCards(gameCards, players[0], selectedHandCard, selectedMainDeckCard)

      // Then
      expect(swappedCards.mainDeck.length).toBe(mainDeckLength - 1);
    });

    xit('Should return winner after swapping cards if player played winning hand', () => {
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
      const selectedHandCard = selectCardFromPlayerHand(gameCards.players[playerId], gameCards.players[playerId][0]);
      const selectedMainDeckCard = 1;

      // When
      const game = swapCards(gameCards, playerId, selectedHandCard, selectedMainDeckCard)

      // Then
      expect(game.winner).toBe(playerId);
    });

    // TODO:
    xit('Should throw error if attempting to reshuffle when main deck is not empty ', () => { });
    xit('Should throw error if playerId is not passed in when swapping ', () => { });
    xit('Should throw error if selectedHandCard is not passed in when swapping', () => { });
    xit('Should throw error if selectedDeckCard is not passed in when swapping ', () => { });
  });
});

describe('game functions', () => {
  describe('shuffling ', () => {
    xit('Should throw error if main deck is not empty when attempting to reshuffle', () => {
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

    xit('Should throw error if discard pile is empty when attempting to reshuffle', () => {
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

    xit('Should reshuffle all cards from discard pile except the top card', () => {
      // Given
      const mainDeck = [];
      const discardPile = [12, 52, 13, 42, 55, 26, 17, 48];

      // When
      const reshuffledDeck = reshuffleDiscardPile({ mainDeck, discardPile });

      // Then
      expect(reshuffledDeck.discardPile).toEqual(expect.arrayContaining([discardPile[0]]));
    });

    xit('Should reshuffle all cards from discard pile to main deck', () => {
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
});