import { useEffect, useState } from 'react';

import { useUser } from '@auth0/nextjs-auth0';
import {
  Button,
  Container,
  FormControl,
  Input,
  Text,
  Center,
  Wrap,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  ModalFooter,
  FormLabel,
} from '@chakra-ui/react';

import Layout from '../../../components/Layout';

import socket from '../../../utils/utils';
import axios from 'axios';
import {
  emitCreateGame,
  emitEndGame,
  emitAction,
  emitTrueSum,
  emitActionUser,
} from '../../../utils/sockets';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

const Admin = () => {
  const router = useRouter();
  const { isOpen: paramsIsOpen, onOpen: paramsOnOpen, onClose: paramsOnClose } = useDisclosure();

  const [cookies, setCookie] = useCookies(['accessToken']);

  const [gameId, setGameId] = useState('');
  const [activeGames, setActiveGames] = useState('');
  const [output, setOutput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [numPlayers, setNumPlayers] = useState(0);
  const [minSpread, setMinSpread] = useState(0);
  const [maxSpread, setMaxSpread] = useState(0);
  const [cardRangeLow, setCardRangeLow] = useState(0);
  const [cardRangeHigh, setCardRangeHigh] = useState(0);

  useEffect(() => {
    socket.emit('retrieveGames', {});
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setGameId(event.target.value);
  // const handleParamChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
  //   setParams(event.target.value);

  const handleChangeWithSetState = (setState: Function) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.value) {
        setState(0);
      } else {
        if (typeof event.target.value == 'number') {
          setState(event.target.value);
        } else {
          setState(parseInt(event.target.value));
        }
      }
      // if (typeof event.target.value == 'number') {
      //   setState(event.target.value);
      // } else {
      //   setState(parseInt(event.target.value)) || setState(event.target.value);
      // }
    };
  };

  useEffect(() => {
    console.log(socket);

    let verifyUser = async () => {
      var response;
      try {
        response = await axios.get(process.env.BACKEND_ROUTE + '/user/isAdmin', {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        });
        setIsAdmin(response.data.isAdmin);
      } catch (err: any) {
        console.log(err);
      }
    };

    verifyUser();

    socket.on('response', (res) => {
      console.log(res);
      setOutput(JSON.stringify(res.data));
      // if (res.pathname.includes('createGame')) {
      //   alert('Successfully created ' + res.body.gameRoomId)
      // }
    });

    socket.on('connect_error', (err) => {
      console.log(err); // prints the message associated with the error
      setOutput(JSON.stringify(err));
    });

    socket.on('error', (err) => {
      console.log(err); // prints the message associated with the error
      setOutput(JSON.stringify(err));
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });

    socket.on('sendGames', (res) => {
      setActiveGames(res.games.join('\n'));
    });
  }, [cookies.accessToken]);

  return isAdmin ? (
    <Layout>
      <Container mt={2}>
        <Center>
          <Text fontSize='4xl'>Admin</Text>
        </Center>
        <Input id='gameId' placeholder='Game ID/Username' value={gameId} onChange={handleChange} />
        {/* <Textarea
            id='params'
            placeholder='Params'
            mt={1}
            value={params}
            onChange={handleParamChange}
          /> */}
        <Button onClick={paramsOnOpen} colorScheme='teal' sx={{ marginTop: '1em' }}>
          Game Parameters
        </Button>
        <Modal isOpen={paramsIsOpen} onClose={paramsOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Game Parameters</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack gap={1}>
                <FormControl isRequired>
                  <FormLabel htmlFor='num_players'># Players</FormLabel>
                  <Input
                    id='num_players'
                    placeholder='# Players'
                    value={numPlayers}
                    onChange={handleChangeWithSetState(setNumPlayers)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor='min_spread'>Min Spread</FormLabel>
                  <Input
                    id='min_spread'
                    placeholder='Min Spread'
                    value={minSpread}
                    onChange={handleChangeWithSetState(setMinSpread)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor='max_spread'>Max Spread</FormLabel>
                  <Input
                    id='max_spread'
                    placeholder='Max Spread'
                    value={maxSpread}
                    onChange={handleChangeWithSetState(setMaxSpread)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor='card_range_low'>Minimum Card Value</FormLabel>
                  <Input
                    id='card_range_low'
                    placeholder='Minimum Card Value'
                    value={cardRangeLow}
                    onChange={handleChangeWithSetState(setCardRangeLow)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor='card_range_high'>Maximum Card Value</FormLabel>
                  <Input
                    id='card_range_high'
                    placeholder='Maximum Card Value'
                    value={cardRangeHigh}
                    onChange={handleChangeWithSetState(setCardRangeHigh)}
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={paramsOnClose}>
                Save
              </Button>
              {/* <Button colorScheme='blue' mr={3} isLoading={props.isSubmitting} type='submit'>
                  Submit
                </Button>
                <Button variant='ghost' onClick={onClose}>Cancel</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Wrap mt={4} justify={'center'}>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitCreateGame(gameId, {
                num_players: numPlayers,
                min_spread: minSpread,
                max_spread: maxSpread,
                card_range_low: cardRangeLow,
                card_range_high: cardRangeHigh,
              });
              setNumPlayers(0);
              setMinSpread(0);
              setMaxSpread(0);
              setCardRangeLow(0);
              setCardRangeHigh(0);
              socket.emit('retrieveGames', {});
            }}
          >
            Create
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'startGame', {});
            }}
          >
            Start
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitEndGame(gameId);
              console.log('sdf');
            }}
          >
            End
          </Button>

          <Button
            colorScheme='teal'
            onClick={() => {
              emitActionUser('drop', { username: gameId });
            }}
          >
            Drop
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'playerPositions', {});
            }}
          >
            Player Positions
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitTrueSum(gameId);
            }}
          >
            True Sum
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'revealedCards');
            }}
          >
            Revealed Cards
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'truePnl');
            }}
          >
            True PnL
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'spread');
            }}
          >
            Spread
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'range');
            }}
          >
            Range
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'players');
            }}
          >
            Players
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'currentPlayer');
            }}
          >
            Current Player
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              emitAction(gameId, 'playerCard');
            }}
          >
            Player Cards
          </Button>
        </Wrap>
        <Text mt={2}>Active Games</Text>
        <Textarea mt={2} value={activeGames} isDisabled placeholder='There are no active games' />
        <Button
          mt={2}
          colorScheme='teal'
          onClick={() => {
            socket.emit('retrieveGames', {});
          }}
        >
          Refresh
        </Button>
        <Text mt={2}>Output</Text>
        <Textarea mt={2} value={output} isDisabled placeholder='No output' />
      </Container>
    </Layout>
  ) : (
    <Layout>
      <Text>You are not an admin</Text>
    </Layout>
  );
};

export default Admin;
