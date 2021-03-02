// =============== IMPORTS

const express = require('express');
const { moveController } = require('@controllers');

// =============== CONSTS

let router = express.Router();

// ===============  MODULE FUNCTIONS

router.get('/move', async (req, res) => {
  const {
    body: {
      type,
    }
  } = req
  try {
    const move = await moveController.playMove(type)
    res.status(200).send({ move });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});

module.exports = router; 