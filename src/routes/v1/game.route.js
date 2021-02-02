/**
 * Required External Modules
 */


const express = require("express");
// const axios = require("axios");
// const bodyParser = require("body-parser");
const {
  // newDeck,
  // shuffleCards,
  // reshuffleDiscardPile,
  dealCards,
  // showDiscardPile,
  // showPlayersHand,
  // selectCardFromDiscardPile,
  // selectCardFromHand,
  // selectCardFromMainDeck,
  // swapCards,
  // isRackOh,
  // checkForRackOh,
} = require('../../controllers/game.controller');
// const {
//   gameController: createGame, getGame
// } = require('../../controllers/game.controller');

// const router = express.Router();

// router
//   .route('/')
//   .get(
//     () => { },
//     () => { },
//     getGame
//   );

// router
//   .route('/start')
//   .get(
//     () => { },
//     () => { },
//     createGame
//   )

// router
//   .post('/register', validate(authValidation.register), authController.register);

// module.exports = router;

const app = express();

/**
 * Start game

 * @param {integer} playerCount
 * @returns
 */
app.get("/start-game", (req, res) => {
  try {
    // start new deck
    // but only return current players deck + discard pile
    const newDeck = dealCards([], 2)
    return res.json(newDeck);
  }
  catch (error) {
    console.log('ERROR:', error);
    return res.status(500).json(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("RACK-OH!");
});