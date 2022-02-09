// import { Router } from 'express';
// import { createGame, joinGame, pythonServerPost } from '../controllers/game.controller';
// import { secured } from '../middleware/secured';

// // export default {
// //   route: '/game',
// //   router: () => {
// //     const router = Router();

// //     router.get('/game_choices', secured(), (_req, res) => {
// //       res.send(['B']);
// //     });

// //     router.post('/create_game', secured(), createGame);

// //     router.post('/join_game', secured(), joinGame);

// //     router.post('/make_market', secured(), (req, res) => pythonServerPost(req, res, 'makeMarket'));

// //     router.post('/transact', secured(), (req, res) => pythonServerPost(req, res, 'transact'));

// //     router.post('/drop', secured(), (req, res) => pythonServerPost(req, res, 'drop'));

// //     router.post('/undo', secured(), (req, res) => pythonServerPost(req, res, 'undo'));

// //     router.post('/end_game', secured(), (req, res) => pythonServerPost(req, res, 'endGame', true));

// //     router.post('/player_positions', secured(), (req, res) =>
// //       pythonServerPost(req, res, 'playerPositions'),
// //     );

// //     router.post('/revealed_cards', secured(), (req, res) =>
// //       pythonServerPost(req, res, 'revealedCards'),
// //     );

// //     router.post('/truePnl', secured(), (req, res) => pythonServerPost(req, res, 'truePnl', true));

// //     router.post('/turn_list', secured(), (req, res) => pythonServerPost(req, res, 'turnList'));

// //     router.post('/spread', secured(), (req, res) => pythonServerPost(req, res, 'spread'));

// //     router.post('/range', secured(), (req, res) => pythonServerPost(req, res, 'range'));

// //     router.post('/players', secured(), (req, res) => pythonServerPost(req, res, 'players'));

// //     router.post('/current_player', secured(), (req, res) =>
// //       pythonServerPost(req, res, 'currentPlayer'),
// //     );

// //     router.post('/card_range', secured(), (req, res) => pythonServerPost(req, res, 'cardRange'));

// //     router.post('/player_card', secured(), (req, res) =>
// //       pythonServerPost(req, res, 'playerCard', true),
// //     );

// //     router.post('/game_user', secured(), (req, res) => pythonServerPost(req, res, 'gameUser'));

// //     router.post('/true_sum', secured(), (req, res) => pythonServerPost(req, res, 'trueSum', true));

// //     return router;
// //   },
// // };
