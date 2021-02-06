const express = require('express');
const gameRoute = require('@routes/v1/game.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/game',
    route: gameRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;