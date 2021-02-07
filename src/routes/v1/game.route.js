const express = require('express');
const {
  getGame,
  createGame,
  playMove
} = require('@controllers/game.controller');
let router = express.Router();

// get game
router.get('/:id', async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const game = await getGame(id);
    if (Object.keys(game).length === 0) {
      res.status(204).send({ ...game });
    }
    res.status(200).send({ ...game });
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
});

// create game
router.post('/new', async (req, res) => {

  const {
    body: { players },
    sessionID,
  } = req
  try {
    const game = await createGame(players, sessionID)
    res.status(200).send({ sessionID, ...game });
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
});

// play move
router.post('/move', async (req, res) => {
  const {
    body: {
      type,

    }
  } = req
  try {
    const move = await playMove(type)
    res
      .status(200).send({ game });
  } catch (err) {
    res.status(500).send({ err })
  }
});


module.exports = router;