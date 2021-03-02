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
    const gameRead = await gameController.getGame(id);

    if (!!gameRead) {
      res.status(200).send({ id, ...game });
    }

    if (!gameRead) {
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
    const gameCreate = await gameController.createGame(players, sessionID)

    if (!!gameCreate) {
      res.status(200).send({ id: sessionID, ...gameCreate });
    }

    if (!gameCreate) {
      // TODO: always create new game, with new sessionID
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
    const gameReset = await gameController.resetGame(id);

    if (gameReset) {
      res.status(200).send({ id, message: GAME_RESET });
    }

    if (!gameReset) {
      res.status(404).send({ id, message: GAME_DOES_NOT_EXIST });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});


module.exports = router;