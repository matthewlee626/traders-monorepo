import { Box, Grid, GridItem, Input, Stack, NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,} from '@chakra-ui/react';
import ButtonModal, {
  BuyModal,
  CardsRevealedModal,
  MakeMarketModal,
  NumericField,
  SellModal,
} from '../ButtonModal';
import styles from './InfoBar.module.scss';
import InfoText from './InfoText';

import { emitActionUser } from "../../utils/sockets";
import React, { useState } from 'react';

const minLots = 1;
const maxLots = 10;
const marketMinLots = 5;
const marketMaxLots = 20;

type InfoBarType = {
  spread: {
    ask: { price: number | null; volume: number | null };
    bid: { price: number | null; volume: number | null };
  };
  position: number;
  cardRange: {
    low: number;
    high: number;
  };
  revealedCards: any[];
  spreadStats: {
    minSpread: number;
    maxSpread: number;
  };
  currentPlayer: string;
  isGameButtonEnabled: boolean;
  yourCard: number | string;
  numPlayers: number;
};

const InfoBar = ({
  spread,
  position,
  cardRange,
  revealedCards,
  spreadStats,
  currentPlayer,
  isGameButtonEnabled,
  yourCard,
  numPlayers
}: InfoBarType) => {

  const [ transactValue, setTransactValue ] = useState(0);

  const handleTransactValueChange = (value: string) => {
    if (parseInt(value)) setTransactValue(parseInt(value));
  }

  const handleSubmit = (type: string) => () => {
    let minTransactionLots = 0, maxTransactionLots = 0;
    if (type === 'buy') {
      minTransactionLots = spread.ask.volume ? Math.min(spread.ask.volume, minLots) : minLots
      maxTransactionLots = spread.ask.volume ? spread.ask.volume : maxLots
    } else if (type === 'sell') {
      minTransactionLots= spread.bid.volume ? Math.min(spread.bid.volume, minLots) : minLots
      maxTransactionLots= spread.bid.volume ? spread.bid.volume : maxLots
    }
    if (transactValue < minTransactionLots || transactValue > maxTransactionLots) {
      return;
    } else {
      emitActionUser({
        action: type,
        quantity: transactValue,
        price: spread.ask.price,
      });
      setTransactValue(0);
    }
  }

  return (
    <Box className={styles['container']}>
      <Box className={styles['subContainer']}>
        {/* {facts.map((fact, index) => (
          <InfoText key={index} {...fact} />
        ))} */}
        <InfoText title='BID' value={spread.bid.price === null ? `-` : `${spread.ask.price}`} />
        <InfoText
          title='BID VOLUME'
          value={spread.bid.volume === null ? `-` : `${spread.bid.volume}`}
        />

        <InfoText title='ASK' value={spread.ask.price == null ? `-` : `${spread.ask.price}`} />
        <InfoText
          title='ASK VOLUME'
          value={spread.ask.volume == null ? `-` : `${spread.ask.volume}`}
        />
        <InfoText title='POSITION' value={`${position}`} />
        <InfoText title='MIN SPREAD' value={`${spreadStats.minSpread}`} />
        <InfoText title='MAX SPREAD' value={`${spreadStats.maxSpread}`} />
      </Box>
      <Grid templateRows='repeat(2, 1fr)' templateColumns='repeat(2, 1fr)' gap={4} p={4}>
        <GridItem colSpan={2}>
          <NumberInput
            value={transactValue}
            onChange={(val: string) => handleTransactValueChange(val)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>  
        </GridItem>
        <GridItem colSpan={1}>
          {/* <BuyModal
            isGameButtonEnabled={spread.ask.volume && isGameButtonEnabled}
            minLots={spread.ask.volume ? Math.min(spread.ask.volume, minLots) : minLots}
            maxLots={spread.ask.volume ? spread.ask.volume : maxLots}
          /> */}
          <Button
            onClick={handleSubmit('buy')}
            bg={'green'}
            isDisabled={!(spread.ask.volume && isGameButtonEnabled)}
          >
            {'Buy'}
          </Button>
        </GridItem>
        <GridItem colSpan={1}>
          {/* <SellModal
            isGameButtonEnabled={spread.bid.volume && isGameButtonEnabled}
            minLots={spread.bid.volume ? Math.min(spread.bid.volume, minLots) : minLots}
            maxLots={spread.bid.volume ? spread.bid.volume : maxLots}
          /> */}
          <Button
            onClick={handleSubmit('sell')}
            bg={'red'}
            isDisabled={!(spread.bid.volume && isGameButtonEnabled)}
          >
            {'sell'}
          </Button>
        </GridItem>
      </Grid>
      <Stack>
        <GridItem colSpan={2}>
          <MakeMarketModal
            isGameButtonEnabled={isGameButtonEnabled}
            minLots={marketMinLots}
            maxLots={marketMaxLots}
          />
        </GridItem>
      </Stack>
      <Box className={styles['subContainer']}>
        <InfoText title='PLAYER ACTIVE' value={`${currentPlayer}`} />
        <InfoText title='# OF PLAYERS' value={`${numPlayers}`} />
        <InfoText title='YOUR CARD' value={`${yourCard}`} />
        <InfoText title='CARD RANGE' value={`${cardRange.low} - ${cardRange.high}`} />
        <CardsRevealedModal
          buttonText='See Cards Revealed'
          buttonColor='gray.600'
          cards={revealedCards}
        />
      </Box>
    </Box>
  );
};

export default InfoBar;
