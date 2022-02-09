import { Box, Stack, Text } from "@chakra-ui/react"
import { RepeatClockIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react";
import format from 'format-duration'

type TimeClockType = { timeLeft: number; myTurn: boolean };

const TimeClock = ({ timeLeft, myTurn }: TimeClockType) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  // Detecting if it's myTurn.
  // eslint-disable-next-line react-hooks/exhaustive-deps


  // const parseTime = (seconds: number) => {
  //   return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)}${Math.floor(seconds % 60) < 10 ? "0" : ""}`;
  // }

  return (
    <Stack direction={'row'} alignItems={'center'}>
      <RepeatClockIcon />
      {myTurn ? (
        <Text>{format(timeLeft*1000)}</Text>
      ) : (
        <Text>-:--</Text>
      )}
    </Stack>
  );
};

export default TimeClock;
