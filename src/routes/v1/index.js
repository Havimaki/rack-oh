const express = require('express');
const router = express.Router();
const gameRoute = require('@routes/v1/game.route');
// const moveRoute = require('@routes/v1/move.route');

const defaultRoutes = [
  {
    path: '/game',
    route: gameRoute,
  },
  // {
  //   path: '/move',
  //   route: moveRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;