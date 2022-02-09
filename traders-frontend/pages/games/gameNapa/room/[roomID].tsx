import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import styles from './gameNapaRoom.module.scss';

import HistoryTable from '../../../../components/HistoryTable';
import Layout from '../../../../components/Layout';
import InfoBar from '../../../../components/InfoBar';

import socket from '../../../../utils/utils';
import { emitActionUser, emitJoinGame } from '../../../../utils/sockets';
import { useCookies } from 'react-cookie';
import TimeClock from '../../../../components/TimeClock';
import PnLModal from '../../../../components/PnLModal';

// const FRONTEND_URL = "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const DEFAULT_ERROR_MESSAGE =
  'The game has not started yet. Please stay here and wait for the game to start.';
type GameBRoomProps = {
  userToken: any;
};

type Transaction = {
  action: string;
  ask: number;
  ask_lots: number;
  bid: number;
  bid_lots: number;
  player: string;
  price: number;
  quantity: number;
};

function createData(
  action: string,
  name: string,
  bidSize?: number,
  bidValue?: number,
  askValue?: number,
  askSize?: number,
) {
  return { action, name, bidSize, bidValue, askValue, askSize };
}

const rows: any = [];

const GameBRoom = () => {
  const [cookies, setCookie] = useCookies(['accessToken', 'username']);
  const router = useRouter();
  const { roomID } = useRouter().query;

  const [isGameStarted, setIsGameStarted] = useState(false);

  const [spread, setSpread] = useState({
    ask: { price: null, volume: null },
    bid: { price: null, volume: null },
  });
  const [position, setPosition] = useState(0);
  const [cardRange, setCardRange] = useState({ low: 0, high: 999 });
  const [revealedCards, setRevealedCards] = useState([]);

  const [myTurn, setMyTurn] = useState(false);
  const [spreadRange, setSpreadRange] = useState({
    minSpread: 2,
    maxSpread: 10,
  });

  const [currentPlayer, setCurrentPlayer] = useState('null');

  const [username, setUsername] = useState('null');

  const [records, setRecords] = useState(rows);

  const [unAuthorized, setUnAuthorized] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [yourCard, setYourCard] = useState(0);

  // End game variables.
  const [truePnl, setTruePnl] = useState({}); // comes in {username: value, username: value} object
  const [trueSum, setTrueSum] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  // Timing variable.
  const [deadline, setDeadline] = useState(0);

  const [errorMessageFromSocket, setErrorMessageFromSocket] = useState(DEFAULT_ERROR_MESSAGE);

  const { isOpen: endIsOpen, onOpen: endOnOpen, onClose: endOnClose } = useDisclosure();

  const [timeLeft, setTimeLeft] = useState(0);

  const [ numPlayers, setNumPlayers ] = useState(0);

  useEffect(() => {
    if (myTurn) {
      setTimeLeft((deadline - Date.now()) / 1000);
    }
  }, [myTurn, deadline]);

  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft <= 0) {
      setMyTurn(false);
      // return;
    }

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  const handlePenalty = () => {
    emitActionUser('drop', {});
    // redirect to main page
  };

  // const setTimerForFunction = (f) => {
  //   setInterval(() => {
  //     console.log('1')
  //   }, 3000)
  //   f();
  // }

  const updateRecords = (transactionData: Array<Transaction>) => {
    let transactions = [];
    for (const t of transactionData) {
      if (t.action == 'made market')
        transactions.push(
          createData(t.action.toUpperCase(), t.player, t.bid, t.bid_lots, t.ask, t.ask_lots),
        );
      else transactions.push(createData(`${t.action} ${t.quantity} AT ${t.price}`, t.player));
    }
    setRecords(transactions);
  };

  useEffect(() => {
    socket.on('response', (res) => {
      console.log(res);
      setDisplayError(false);

      if (res.data.players) {
        setNumPlayers(res.data.players.length);
      }

      if (res.data.deadline) {
        if (res.data.current_player == cookies.username && deadline != 0) {
          setMyTurn(true);
          setDeadline(res.data.deadline);
        }
      }

      if (res.data.current_player) {
        setIsGameStarted(true);
        if (res.data.current_player == cookies.username){
          setMyTurn(true);
        } else {
          setMyTurn(false);
          setDeadline(0);
          setTimeLeft(0);
        }
        setCurrentPlayer(res.data.current_player);
      }

      if (res.data.spread) {
        setSpread(res.data.spread);
      }

      if (res.data.positions) {
        setPosition(res.data.positions[cookies.username]);
      }

      if (res.data.revealedCards) {
        setRevealedCards(res.data.revealedCards);
      }

      if (res.data.recentTransactions) {
        // const reversed = [...res.data.recentTransactions].reverse();
        updateRecords(res.data.recentTransactions);
      }

      if (res.data.playerCard) {
        setYourCard(res.data.playerCard);
      }

      if (res.data.truePnl) {
        setTruePnl(res.data.truePnl);
        endOnOpen();
      }

      if (res.data.trueSum) {
        setTrueSum(res.data.trueSum);
        // Game has ended
        setGameEnded(true);
      }

      if (res.type == 'drop') {
        router.push(FRONTEND_URL);
      }

      if (res.type == 'penalty') {
        console.log('Penalty socket');
        console.log(res);
      }
      if (res.type == 'startGame') {
        setIsGameStarted(true);
        setYourCard(res.data.playerCard);
        setCurrentPlayer(res.data.current_player);
      } else if (res.type == 'joinGame') {
        setCardRange({
          low: res.data.card_range_low,
          high: res.data.card_range_high,
        });
        setSpreadRange({
          minSpread: res.data.min_spread,
          maxSpread: res.data.max_spread,
        });
      }
    });

    socket.on('connect_error', (err) => {
      setUnAuthorized(true);
      setDisplayError(true);
      setErrorMessageFromSocket(err.message);
      // console.log(err) // prints the message associated with the error
    });

    socket.on('error', (err) => {
      setDisplayError(true);
      setErrorMessageFromSocket(err);
      // console.log(err) // prints the message associated with the error
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });

    if (roomID !== undefined) {
      emitJoinGame(roomID);
    }
  }, [cookies.username, roomID, router]);

  // useEffect(() => {
  //   if (!cookies.accessToken || unAuthorized) {
  //     router.push('/login');
  //   }
  // }, [cookies.accessToken, router, unAuthorized]);

  const handleDropClick = () => {
    emitActionUser('drop');
    // router.push('/games/gameNapa');
  };

  useEffect(() => {
    if (isGameStarted && errorMessageFromSocket != DEFAULT_ERROR_MESSAGE) {
      alert(errorMessageFromSocket);
    }
  }, [errorMessageFromSocket, isGameStarted]);

  useEffect(() => {
    if (gameEnded) {
      endOnOpen();
    }
  }, [gameEnded, endOnOpen]);

  if (!isGameStarted) {
    return (
      <Box className={styles['container']}>
        <Text fontSize='4xl' mt={6}>
          Game B - Room {roomID}
        </Text>
        <Text fontSize='md' mt={5}>
          {errorMessageFromSocket}
        </Text>
        {errorMessageFromSocket == DEFAULT_ERROR_MESSAGE && (
          <Button mt={2} onClick={handleDropClick} colorScheme='red'>
            Exit
          </Button>
        )}
      </Box>
    );
  }
  return (
    <Layout>
      <Box className={styles['container']}>
        <Text fontSize='4xl'>Game Napa - Room {roomID}</Text>
        {/* <Button onClick={handleDropClick} colorScheme="teal">
          Exit
        </Button> */}
        {/* <Text>{errorMessageFromSocket}</Text> */}
        <TimeClock timeLeft={timeLeft} myTurn={myTurn} />
        <InfoBar
          spread={spread}
          position={position}
          cardRange={cardRange}
          revealedCards={revealedCards}
          spreadStats={spreadRange}
          currentPlayer={currentPlayer}
          isGameButtonEnabled={myTurn}
          yourCard={yourCard}
          numPlayers={numPlayers}
        />
        <Box className={styles['info-container']}>
          <Box className={styles['hist-container']}>
            <Text fontSize='2xl' marginBottom={'1em'}>
              Transaction History
            </Text>
            <Box className={styles['hist-table-container']}>
              <HistoryTable rows={records} />
            </Box>

            {/* <Box className={styles['chart-container']}>
          <CandleStickChart series={series} options={options} />
        </Box> */}
          </Box>
        </Box>
      </Box>
      <PnLModal
        rows={truePnl}
        sum={trueSum}
        endIsOpen={endIsOpen}
        endOnOpen={endOnOpen}
        endOnClose={endOnClose}
      />
    </Layout>
  );
};

export default GameBRoom;
