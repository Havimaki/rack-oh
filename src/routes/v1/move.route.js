// =============== IMPORTS
const express = require('express');
const {
  moveController: {
    playMove,
  }
} = require('@controllers');



let router = express.Router();
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
    console.log(err);
    res.status(500).send({ err })
  }
});