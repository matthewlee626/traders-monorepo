import express from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  createGame,
  joinGame,
  pythonServerPenalty,
  pythonServerPost,
  pythonServerResetMarket,
} from './src/controllers/game.controller';

import { serializeUser, deserializeUser } from './src/middleware/cookie';

import userRouter from './src/routes/user.route';
// import gameRouter from './src/routes/game.route';
import { socketsecured } from './src/middleware/secured';

const {
  ATLAS_URI,
  EXPRESS_SESS_SECRET,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_SECRET,
  ACTUAL_MARKET_TIMEOUT,
  ACTUAL_TRANSACT_TIMEOUT,
} = process.env;
if (
  !(
    ATLAS_URI &&
    EXPRESS_SESS_SECRET &&
    AUTH0_CLIENT_ID &&
    AUTH0_DOMAIN &&
    AUTH0_CLIENT_SECRET &&
    ACTUAL_MARKET_TIMEOUT &&
    ACTUAL_TRANSACT_TIMEOUT
  )
) {
  throw console.error('one of the env variable is not found, look at line 42 from index.ts');
}
const TRANSACT_TIMEOUT = parseInt(ACTUAL_TRANSACT_TIMEOUT) + 1000;
const LENIANT_TRANSACT_TIMEOUT = TRANSACT_TIMEOUT + 2000;
const MARKET_TIMEOUT: number = parseInt(ACTUAL_MARKET_TIMEOUT) + 1000; // 2 minutes
const LENIANT_MARKET_TIMEOUT: number = MARKET_TIMEOUT + 2000;

const sess = {
  secret: EXPRESS_SESS_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

const strategy = new Auth0Strategy(
  {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:8080/user/callback',
  },
  (accessToken, _refreshToken, _extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile, accessToken);
  },
);
passport.serializeUser((user: Express.User, done) => serializeUser(user, done));
passport.deserializeUser((user: Express.User, done) => deserializeUser(user, done));
passport.use(strategy);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const database = ATLAS_URI;
connect(database)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const mainRouter = express.Router();

mainRouter.get('/', function (_req, res) {
  res.send('Ping Successfull!');
});
app.use('/', mainRouter);
app.use(userRouter.route, userRouter.router());
// app.use(gameRouter.route, gameRouter.router());

if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  // sess.cookie.secure = true;
  app.set('trust proxy', 1);
}

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const wrap = (middleware: Function) => (socket: any, next: Function) =>
  middleware(socket.request, {}, next);

io.use(wrap(session(sess)));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use(socketsecured);

let roomList = new Set();
let endedRooms = new Set();
let socketToRoom = new Map();
let usernameToSocket = new Map();
let openPlayersToTimer = new Map(); // represent the current players that haven't taken their actions

const setMakeMarketTimer = (curr: string, targetRoom: string) => {
  const deadline = Date.now() + MARKET_TIMEOUT;
  const timerId = setTimeout(async () => {
    if (
      openPlayersToTimer.has(curr) &&
      openPlayersToTimer.get(curr)[1] <= Date.now() &&
      roomList.has(targetRoom)
    ) {
      openPlayersToTimer.delete(curr);

      var penaltyRes = await pythonServerPenalty(targetRoom);
      penaltyRes = { data: penaltyRes.data };
      penaltyRes.type = 'penalty';
      const nextPlayer = penaltyRes.data.current_player;
      setMakeMarketTimer(nextPlayer, targetRoom);
      penaltyRes.data.deadline = openPlayersToTimer.get(nextPlayer)[1];
      io.in(targetRoom).emit('response', penaltyRes);
    }
  }, LENIANT_MARKET_TIMEOUT);
  openPlayersToTimer.set(curr, [timerId, deadline]);
};

const setTransactTimer = (curr: string, targetRoom: string) => {
  const deadline = Date.now() + TRANSACT_TIMEOUT;
  const timerId = setTimeout(async () => {
    if (
      openPlayersToTimer.has(curr) &&
      openPlayersToTimer.get(curr)[1] <= Date.now() &&
      roomList.has(targetRoom)
    ) {
      openPlayersToTimer.delete(curr);

      var resetMarketRes = await pythonServerResetMarket(targetRoom);
      resetMarketRes = { data: resetMarketRes.data };
      resetMarketRes.type = 'resetMarket';
      const nextPlayer = resetMarketRes.data.current_player;
      setMakeMarketTimer(nextPlayer, targetRoom);
      resetMarketRes.data.deadline = openPlayersToTimer.get(nextPlayer)[1];
      io.in(targetRoom).emit('response', resetMarketRes);
    }
  }, LENIANT_TRANSACT_TIMEOUT);
  openPlayersToTimer.set(curr, [timerId, deadline]);
};

io.on('connection', (socket: Socket) => {
  console.log('New connection from ' + socket.id);

  socket.on('disconnect', () => {
    socketToRoom.delete(socket.id);
  });

  socket.on('createGame', async (params: any) => {
    let res: any;
    try {
      res = await createGame(params, socket.request);
      const ret = { type: 'createGame', data: res.data };
      io.to(socket.id).emit('response', ret);
      io.emit('sendGames', { type: 'sendGames', games: Array.from(roomList) });
    } catch (err) {
      io.to(socket.id).emit('error', err.message);
    }
    roomList.add(params.gameRoomId);
  });

  socket.on('joinGame', async (params: any) => {
    let { gameRoomId } = params;
    if (endedRooms.has(gameRoomId)) {
      io.to(socket.id).emit('error', 'This game has ended');
    } else if (!roomList.has(gameRoomId)) {
      io.to(socket.id).emit('error', "This game doesn't exist");
    } else {
      let res, username;
      try {
        [res, username] = await joinGame(params, socket.request);
        socket.join(gameRoomId);
        socketToRoom.set(socket.id, gameRoomId);
        usernameToSocket.set(username, socket.id);
        if (openPlayersToTimer.has(res.data.current_player)) {
          res.data.deadline = openPlayersToTimer.get(res.data.current_player)[1];
        }
        const ret = { type: 'joinGame', data: res.data };
        io.to(socket.id).emit('response', ret);
        let tmp = { type: 'newPlayer', data: { players: res.data.players } };
        io.to(gameRoomId).emit('response', tmp);
      } catch (err) {
        io.in(socket.id).emit('error', err.message);
      }
    }
  });

  socket.on('retrieveGames', async () => {
    io.to(socket.id).emit('sendGames', { type: 'sendGames', games: Array.from(roomList) });
  });

  socket.on('actions', async (params: any) => {
    let res: any;
    let gameRoomId = socketToRoom.get(socket.id);
    if (!gameRoomId) {
      gameRoomId = socket.id;
    }

    try {
      res = await pythonServerPost(params, socket.request);
      res = { data: res.data };

      if (params.route === 'makeMarket') {
        // @ts-ignore
        const username = socket.request.user.email;
        clearTimeout(openPlayersToTimer.get(username)[0]);
        openPlayersToTimer.delete(username);
        setTransactTimer(username, gameRoomId);
        res.data.deadline = openPlayersToTimer.get(username)[1];
      } else if (params.route === 'startGame') {
        const curr = res.data.current_player;
        var targetRoom;
        if (params.gameRoomId) {
          targetRoom = params.gameRoomId;
        } else {
          targetRoom = gameRoomId;
        }
        setMakeMarketTimer(curr, targetRoom);
        res.data.deadline = openPlayersToTimer.get(curr)[1];
        io.to(socket.id).emit('response', { data: { message: 'Game started' } });
        for (let [key, val] of Object.entries(res.data.player_cards) as any) {
          const socketID = usernameToSocket.get(key);
          const current_player = res.data.current_player;
          io.in(socketID).emit('response', {
            type: 'startGame',
            data: {
              playerCard: val,
              current_player: current_player,
              deadline: openPlayersToTimer.get(current_player)[1],
            },
          });
        }
      } else if (params.route === 'drop') {
        res.type = params.route;
        var targetUser;
        if (params.username) {
          targetUser = params.username;
        } else {
          // @ts-ignore
          targetUser = socket.request.user.email;
        }
        io.in(usernameToSocket.get(targetUser)).emit('response', res);
      }
      if (params.gameRoomId) {
        res.type = params.route;
        io.to(socket.id).emit('response', res);
      } else {
        res.type = params.route;
        io.to(gameRoomId).emit('response', res);
      }

      if (params.route == 'endGame') {
        res.type = params.route;
        io.to(params.gameRoomId).emit('response', res);
        io.socketsLeave(params.gameRoomId); // clear and delete the room
        roomList.delete(params.gameRoomId);
        endedRooms.add(params.gameRoomId);

        for (let [key, val] of socketToRoom) {
          if (val === params.gameRoomId) {
            socketToRoom.delete(key);
          }
        }
        io.emit('sendGames', { type: 'sendGames', games: Array.from(roomList) });
      } else if (params.route === 'drop' && !params.username) {
        socketToRoom.delete(socket.id);
        socket.leave(gameRoomId);
      }
    } catch (err) {
      err.type = params.route;
      io.to(socket.id).emit('error', err.message);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
