import socket from './utils';

export let emitAction = (gameRoomId, routeName, additionalParams) => {
  console.log('Emit action', routeName);
  if (!gameRoomId) {
    alert('Please enter a game room id');
    return;
  }

  let params = {
    gameRoomId: gameRoomId,
    route: routeName,
    ...additionalParams,
  };

  console.log(params);

  socket.emit('actions', params);
};

export let emitActionUser = (routeName, additionalParams) => {
  console.log('Emit action user', routeName);

  let params = {
    route: routeName,
    ...additionalParams,
  };

  console.log(params);

  socket.emit('actions', params);
};

export let emitTrueSum = (gameRoomId) => {
  if (!gameRoomId) {
    alert('Please enter a game room id');
    return;
  }
  let params = {
    gameRoomId: gameRoomId,
    route: 'trueSum',
  };
  socket.emit('actions', params);
};

export let emitEndGame = (gameRoomId) => {
  if (!gameRoomId) {
    alert('Please enter a game room id');
    return;
  }
  let params = {
    gameRoomId: gameRoomId,
    route: 'endGame',
  };

  socket.emit('actions', params);
};

export let emitCreateGame = (gameRoomId, gameParams) => {
  if (!gameParams.num_players) {
    alert('Please fill out the game parameters');
    return;
  }
  if (!gameRoomId) {
    alert('Please enter a game room id');
    return;
  }
  let params = {
    gameRoomId: gameRoomId,
    ...gameParams,
  };
  // console.log(params)
  socket.emit('createGame', params);
};

export let emitJoinGame = (gameRoomId) => {
  let params = {
    gameRoomId: gameRoomId,
  };

  socket.emit('joinGame', params);
};
