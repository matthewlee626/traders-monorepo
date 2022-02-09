import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useCookies } from 'react-cookie';
import Link from 'next/link';

const Header = () => {
  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //     setMounted(true)
  // }, [])
  const [cookies, setCookie] = useCookies(['accessToken']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (cookies.accessToken) {
      // console.log('logged in');
      setIsLoggedIn(true);
    }
  }, [cookies.accessToken]);

  // https://dev.to/adrien/creating-a-custom-react-hook-to-get-the-window-s-dimensions-in-next-js-135k

  return (
    <Box className={styles['container']}>
      <Box>
        <Link href='/' as='/' passHref>
          <Text sx={{ cursor: 'pointer' }}>TRADERS AT BERKELEY</Text>
        </Link>
      </Box>
      <Box className={styles['menu']}>
        {
          !isLoggedIn ? (
            <Link href='/login' as='/login' passHref>
              <Text sx={{ cursor: 'pointer' }}>LOGIN</Text>
            </Link>
          ) : (
            <Link href='/clearToken' as='/clearToken' passHref>
              <Text sx={{ cursor: 'pointer' }}>LOGOUT</Text>
            </Link>
          )
        }
      </Box>
    </Box>
  );
};

export default Header;
