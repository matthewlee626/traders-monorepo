import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import socket from './util/socketConnection';

function App() {
  const [route, setRoute] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [tokenName, setTokenName] = useState('andrew');
  const andrewToken =
    'Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtajdvaWd1eGgudXMuYXV0aDAuY29tLyJ9..riFhAYOsE-jneVcX.PrYMMSAqCQcjYBNIsywr8uKuqryr33iNmqAddeZ5L5W-L9wg7DsHT6SKABVU5T7O8PCNzDxRYjf0bTaF8CdPIrYe7KCEx90fnFCey640Ap4ymUBx4K2rF1aKAt3euq3DIHdvN8YZWnYpxqmkL1mQXK_1WCEylgEHFRTFaF_kI3h77JMU_VwHujS4mthEYbAMm0VWYdBPUpRyTozE5V4PkiQH9vsziIZDUUj_XNAuxXe0jOqi_9c2x0HvCMyb0Ldtd2W4_OYXgvXX_a9hrP8TqY64KOcLqo7cSbRtjNZ3maJXSFLinYlxsGrJ8RT0E9HFZ70GA18zJw.KlV5dT7-yJHM51oOwKOT4w';
  const kenzieToken =
    'Bearer eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtajdvaWd1eGgudXMuYXV0aDAuY29tLyJ9..rg8WzztFJG7TKXZu.nZcdaC4JcijzMePxYNr7JssTytRvYVTXOx4HnFSfeCJRyGZv-KiWf9FDPrv_fc-dMU9OgCFy8Ki0gA4riUZmadlm3tWbv2_tcxnmhvCztlnjadYjfBZL0B44WEepKjSLZ4dvXexT1kpr5W0bFtJqxXxKzA4VGtHp3IiSzyXhHv1HcAUivhH9O0yM4erdx3PGqyLqUdiyUGCBj6791VoF3lCzUoVanLEWRZfGiD_9le_uFwAZGzTXWqYmfqSDp51KXMrmg24h39zojOtsutfhuPzNk9Q3pxRm7jh1-ipmla8BullEdxgq5RXxBOLaT27Efo9qjssoKA.HiHy1jshVkzcNjxxu_HPVQ';
  var token = kenzieToken;

  const handleSubmit = (e) => {
    e.preventDefault();
    emitAction(route);
  };

  useEffect(() => {
    console.log('use effect');
    console.log('socket', socket);
    socket.on('response', (res) => {
      console.log(res);
    });

    socket.on('connect_error', (err) => {
      console.log(err); // prints the message associated with the error
    });

    socket.on('error', (err) => {
      console.log(err); // prints the message associated with the error
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  }, []);

  let emitAction = (routeName) => {
    console.log('Emit action', routeName);
    let obj = JSON.parse(jsonContent);
    // obj.route = routeName;

    let params = {
      // gameRoomId: "TestRoomB",
      route: routeName,
      ...obj,
    };
    console.log(socket);
    socket.emit('actions', params);
  };

  let emitTrueSum = () => {
    let params = {
      gameRoomId: 'TestRoomB',
      route: 'trueSum',
    };
    socket.emit('actions', params);
  };

  let emitEndGame = () => {
    let params = {
      gameRoomId: 'TestRoomB',
      route: 'endGame',
    };

    socket.emit('actions', params);
  };

  let emitCreateGame = () => {
    let params = {
      num_players: 30,
      min_spread: 5,
      max_spread: 20,
      card_range_low: 1,
      card_range_high: 30,
      override: false,
      gameRoomId: 'TestRoomB',
    };
    socket.emit('createGame', params);
  };

  let emitJoinGame = () => {
    let params = {
      gameRoomId: 'TestRoomB',
    };

    socket.emit('joinGame', params);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <form onSubmit={handleSubmit}>
          <input type='submit' value='take action' />
          route:
          <input type='text' value={route} onChange={(e) => setRoute(e.target.value)} />
          <br />
          <br />
          params:
          <textarea
            type='text'
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
          />
        </form>
        <br />
        <button onClick={emitCreateGame}>CreateGame</button>
        <button onClick={emitJoinGame}>JoinGame</button>
        <button onClick={emitTrueSum}>TrueSum</button>
        <button onClick={emitEndGame}>EndGame</button>
      </header>
    </div>
  );
}

export default App;
