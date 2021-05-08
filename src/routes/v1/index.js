// =============== IMPORTS

const express = require('express');
const router = express.Router();
const gameRoute = require('./game.route');
const moveRoute = require('./move.route');

// ===============  MODULE FUNCTIONS

const defaultRoutes = [
  {
    path: '/game',
    route: gameRoute,
  },
  {
    path: '/:gameId/move',
    route: moveRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;