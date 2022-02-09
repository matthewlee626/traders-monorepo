import Head from 'next/head'


import { Box, Stack } from '@chakra-ui/react'

import styles from './Layout.module.scss'
import Header from '../Header';
import { useCookies } from 'react-cookie';

type LayoutProps = {
  children?: React.ReactNode,
  title? : string,
  isIndex?: boolean
}


const Layout = ({children, title="Traders at Berkeley", isIndex=false} : LayoutProps) => {
  const [ cookies, setCookie, removeCookie ] = useCookies(['accessToken', 'username']);

  return (
    <Box>
      <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
      <Stack spacing={0}>
        <Header />
        <Stack justifyContent={isIndex ? 'center' : 'flex-start'} alignItems='center' sx={{height: isIndex ? '80vh' : 'inherit', textAlign: 'center'}}>
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Layout
