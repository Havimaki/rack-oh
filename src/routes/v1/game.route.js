// =============== IMPORTS

const express = require('express');
const { gameController } = require('@controllers');
const { responseCodes: {
  GAME_CODES: {
    ERROR,
    SUCCESS,
  },
},
} = require('@constants');

// =============== CONSTS

let router = express.Router();

const GAME_ALREADY_EXISTS = ERROR.CONFLICT;
const GAME_DOES_NOT_EXIST = ERROR.NOT_FOUND;
const GAME_RETRIEVED = SUCCESS.GET;
const GAME_CREATED = SUCCESS.POST;
const GAME_RESET = SUCCESS.PUT;

// ===============  MODULE FUNCTIONS

router.get('/:id', async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const data = await gameController.getGame(id);

    if (!data) {
      return res.status(404).send({
        id,
        message: GAME_DOES_NOT_EXIST,
      });
    }

    return res.status(200).send({
      id: data[0].session_id,
      message: GAME_RETRIEVED,
    });


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
    const data = await gameController.createGame(sessionID, players)

    if (!data) {
      return res.status(409).send({
        id: sessionID,
        message: GAME_ALREADY_EXISTS,
      });
    }

    return res.status(200).send({
      id: sessionID,
      message: GAME_CREATED,
      ...data
    });


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
    const data = await gameController.resetGame(id);

    if (!data) {
      return res.status(404).send({
        id,
        message: GAME_DOES_NOT_EXIST,
      });
    }

    return res.status(200).send({
      id,
      message: GAME_RESET,
    });


  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});


module.exports = router;