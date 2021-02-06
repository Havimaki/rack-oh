const express = require('express');
const {
  createGame,
  playMove
} = require('@controllers/game.controller');

let router = express.Router();

// create game
router.post('/new', async (req, res) => {
  const {
    body: { players }
  } = req
  try {
    const game = await createGame(players)
    res.status(200).send({ ...game });
  } catch (err) {
    res.status(500).send({ err })
  }
});

// 
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