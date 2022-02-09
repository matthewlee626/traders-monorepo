import axios from 'axios';
import Users from '../models/user.model';
import Games from '../models/games.model';

const { FLASK_PASSCODE, FLASK_URL } = process.env;
if (!FLASK_PASSCODE && !FLASK_URL) {
  throw console.error('FLASK_PASSCODE not in .env');
}

export const createGame = async (params: any, req: any) => {
  if (!req.user) {
    throw new Error("req.user doesn't have the user");
  }
  const { isAdmin } = req.user;
  if (!isAdmin) {
    throw new Error('only admins are allowed to start a game');
  }

  const gameChoice = 'B';
  if (!gameChoice) {
    return 'gameChoice should be included in the body';
  }
  const url = `${FLASK_URL}/Game${gameChoice}/createGame`;
  var response;

  try {
    params.password = FLASK_PASSCODE;
    params.game_id = params.gameRoomId;
    response = await axios.post(url, params);
  } catch (err) {
    console.error(
      `There was an error when calling python server at this url: ${url} & this body: ${JSON.stringify(
        params,
      )}`,
    );
    throw new Error(err.response.data);
  }
  return response;
};

export const joinGame = async (params: any, req: any) => {
  const { gameRoomId } = params;

  if (!req.user) {
    throw new Error("req.user doesn't have the user");
  }
  const { email } = req.user;
  const dbUser = await Users.findOne({ email });

  if (dbUser?.gameRoomId && dbUser?.gameRoomId != gameRoomId) {
    throw new Error('You are already in another game');
  }

  const url = `${FLASK_URL}/GameB/addUser`;
  const body = { ...params, username: email, game_id: gameRoomId, password: FLASK_PASSCODE };
  var response;
  try {
    response = await axios.post(url, body);
    req.user.gameRoomId = gameRoomId;
    req.user.gameChoice = 'B';
    await Users.updateOne({ email }, { gameChoice: 'B', gameRoomId });
  } catch (err) {
    console.error(
      `There was an error when calling python server at this url: ${url} & this body: ${JSON.stringify(
        body,
      )}`,
    );
    throw new Error(err.response.data);
  }
  return [response, email];
};

const pythonServerTimeoutHelper = async (gameRoomId: string, route: string) => {
  const body = { game_id: gameRoomId, password: FLASK_PASSCODE };
  const url = `${FLASK_URL}/GameB/${route}`;
  var response: any;

  try {
    response = await axios.post(url, body);
  } catch (err) {
    console.error(
      `There was an error when calling python server at this url: ${url} & this body: ${JSON.stringify(
        body,
      )}`,
    );
    throw new Error(err.response.data);
  }
  return response;
};

export const pythonServerPenalty = async (gameRoomId: string) => {
  const res = await pythonServerTimeoutHelper(gameRoomId, 'penalty');
  return res;
};

export const pythonServerResetMarket = async (gameRoomId: string) => {
  const res = await pythonServerTimeoutHelper(gameRoomId, 'resetMarket');
  return res;
};

export const pythonServerPost = async (params: any, req: any) => {
  const isAdminOnlyRoutes = new Set(['endGame', 'truePnl', 'trueSum', 'playerCard']);
  const { route } = params;
  const isAdminOnly = isAdminOnlyRoutes.has(route);

  if (!req.user) {
    throw new Error("req.user doesn't have the user");
  }
  var { email, gameChoice, isAdmin, gameRoomId } = req.user;
  gameChoice = 'B';
  if (isAdminOnly && !isAdmin) {
    throw new Error('only admins are allowed to call this route');
  }
  if (!gameRoomId && !isAdmin) {
    throw new Error(`${email} needs to join a game first`);
  }

  // if calling action for self, no need to pass in username
  // only admin can call action on another member
  // user property is expected to take in the email
  var user = email;
  if (params.username && isAdmin) {
    const inputtedUsername = params.username;
    user = inputtedUsername;

    // go to the database to get info on the user's gameRoomId
    const dbUserInfo = await Users.findOne({ email: inputtedUsername });
    if (dbUserInfo?.gameRoomId) {
      gameRoomId = dbUserInfo.gameRoomId;
    } else {
      throw new Error(`${inputtedUsername} needs to sign up and join a game first`);
    }
  } else if (params.gameRoomId && isAdmin) {
    gameRoomId = params.gameRoomId;
  } else if (params.username) {
    throw new Error('You are not allowed to call this route for someone else');
  }

  const body = { ...params, user, game_id: gameRoomId, password: FLASK_PASSCODE };
  const url = `${FLASK_URL}/Game${gameChoice}/${route}`;
  var response: any;

  try {
    response = await axios.post(url, body);
  } catch (err) {
    console.error(
      `There was an error when calling python server at this url: ${url} & this body: ${JSON.stringify(
        body,
      )}`,
    );
    throw new Error(err.response.data);
  }

  // special case for removing player
  if (route === 'drop') {
    delete req.user.gameRoomId;
    await Users.updateOne({ email: user }, { gameRoomId: '' });
  }
  if (route == 'endGame' && isAdmin) {
    try {
      await Users.updateMany({ gameRoomId: params.gameRoomId }, { gameRoomId: '' });
      let game = new Games({
        gameRoomID: params.gameRoomId,
        data: response.data.logs,
        trueSum: response.data.trueSum,
        truePnl: response.data.truePnl,
        penalties: response.data.penalties,
      });
      await game.save();
    } catch (err) {
      console.log(err);
    }
  }

  return response;
};
