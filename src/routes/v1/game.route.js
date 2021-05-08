// =============== IMPORTS

const express = require('express');
const { gameController } = require('@controllers');
const { responseConstants } = require('@constants');

// =============== CONSTS

let router = express.Router();

const GAME_ALREADY_EXISTS = responseConstants.GAME_ALREADY_EXISTS;
const GAME_DOES_NOT_EXIST = responseConstants.GAME_DOES_NOT_EXIST;
const GAME_RESET = responseConstants.GAME_RESET;


// ===============  MODULE FUNCTIONS

router.get('/:id', async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const game = await gameController.getGame(id);

    if (!!game) {
      res.status(200).send({ id, ...game });
    }

    if (!game) {
      res.status(404).send({ id, message: GAME_DOES_NOT_EXIST });
    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
});

router.post('/new', async (req, res) => {
  const {
    body: { players },
    sessionID,
  } = req
  try {
    const game = await gameController.createGame(sessionID, players)

    if (!!game) {
      res.status(200).send({ id: sessionID, ...game });
    }

    if (!game) {
      res.status(409).send({ id: sessionID, message: GAME_ALREADY_EXISTS });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});

router.post('/reset/:id', async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const game = await gameController.resetGame(id);

    if (game) {
      res.status(200).send({ id, message: GAME_RESET });
    }

    if (!game) {
      res.status(404).send({ id, message: GAME_DOES_NOT_EXIST });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});


module.exports = router;