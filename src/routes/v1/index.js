const express = require('express');
const gameRoute = require('./game.route');
// const config = require('../../config/index');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/game',
    route: gameRoute,
  },
  {
    path: '/',
    route: gameRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {},
];

// defaultRoutes.forEach((route) => {
//   router.use(route.path, route.route);
// });

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;