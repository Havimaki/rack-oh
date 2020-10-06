// index.js

/**
 * Required External Modules
 */

const express = require("express");
// const path = require("path");
const redis = require("redis");
const axios = require("axios");

const bodyParser = require("body-parser");
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
} = require('./game');

/**
 * App Variables
 */

const port = process.env.PORT || 5000;
const port_redis = process.env.PORT || 6379;

/**
 *  App Configuration
 */

const redis_client = redis.createClient(port_redis);
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("RACK-OH!");
});

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



/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`)
});