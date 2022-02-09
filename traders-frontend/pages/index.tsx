import type { NextPage } from 'next'
import Link from 'next/link'
import { io } from "socket.io-client";

import { Button, Stack, Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

// import Header from '../components/Header'
// import styles from '../styles/Home.module.css'
import Layout from '../components/Layout';
import { useCookies } from 'react-cookie';

const Home: NextPage = () => {
  const [ cookies, setCookie ] = useCookies(['accessToken']);

  // console.log(cookies)

  return (
    <Layout isIndex>
      {/* <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a> */}
      <Stack align="center" justify='center' sx={{height: '100%'}}>
        <Text fontSize="4xl">Berkeley Trading Competition</Text>
        <Text fontSize="xl">HOSTED BY TRADERS AT BERKELEY</Text>
        <Box>
          <Link href="/games" passHref={true}>
            <Button variant="outline" colorScheme={'black'} >PLAY NOW</Button>
          </Link>
        </Box>
      </Stack>
    </Layout>
  )
}

export default Home
