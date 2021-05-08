// =============== IMPORTS

const express = require('express');
const { moveController } = require('@controllers');

// =============== CONSTS

let router = express.Router();

// ===============  MODULE FUNCTIONS

// get
router.get('/cards/player/:name', async (req, res) => {
  const {
    params: {
      name,
      sessionID
    },
  } = req
  try {

    const move = await moveController.showPlayerHand(
      sessionID,
      name
    );
    console.log(move)
    res.status(200).send({ move });

  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});
router.get('/cards/discard', async (req, res) => {
  const {
    sessionID,
  } = req
  try {
    const move = await moveController.showDiscardPile(sessionID);
    res.status(200).send({ move });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

// post
router.post('/cards/swap', async (req, res) => {
  const {
    body: {
      player,
      card,
      deck,
    },
    sessionID,
  } = req
  try {
    const move = await moveController.selectCardFromMainDeck(sessionID, player, card, deck);
    res.status(200).send({ move });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err });
  }
});

module.exports = router;