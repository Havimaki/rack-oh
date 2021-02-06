const express = require('express');
const {
  createGame
} = require('../../controllers/game.controller');
let router = express.Router();


router.get('/', (req, res, next) => {
  try {
    res.status(200).send({ message: 'RACK-OH!' })
  } catch (e) {
    console.log(e)
  }
})

router.get('/create-game', async (req, res) => {
  const {
    body: { players }
  } = req
  try {
    const game = await createGame(players)

    res.send('200', {
      game
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
});

module.exports = router;



////////////////////////////////////////////////

// const express = require('express');
// const gameRoute = require('./game.route');
// const router = express.Router();
// // const defaultRoutes = [
// //   {
// //     path: '/game',
// //     route: gameRoute,
// //   },
// // ];
// // defaultRoutes.forEach((route) => {
// //   router.use(route.path, route.route);
// // });
// router.get('/', function (req, res) {
//   res.json({ 'message': 'Ping Successfull' });
// });

////////////////////////////////////////////////