import type { NextPage } from 'next';
import { Container, Text } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import GameSelect from '../../components/GameSelect';

const GameData = [
  {
    title: 'Game Napa',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor pellentesque at sem semper at feugiat pulvinar turpis faucibus.',
    image: 'https://source.unsplash.com/random/400x400',
    link: '/games/gameNapa',
    buttonText: 'Enter Room',
  },
  // {
  //   title: "Game C",
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor pellentesque at sem semper at feugiat pulvinar turpis faucibus.",
  //   image: "https://source.unsplash.com/random/400x400",
  //   link: "/games/gameC",
  //   buttonText: "Upload Code"
  // },
  // {
  //   title: "Game D",
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor pellentesque at sem semper at feugiat pulvinar turpis faucibus.",
  //   image: "https://source.unsplash.com/random/400x400",
  //   link: "/games/gameD",
  //   buttonText: "Upload Code"
  // }
];

const Games: NextPage = () => {
  return (
    <Layout>
      <Text fontSize="4xl">Game Select</Text>
      <Container>
        {GameData.map((game, index) => (
          <GameSelect key={index} {...game} />
        ))}
      </Container>
    </Layout>
  );
};

export default Games;
