import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';

const ReceiveToken = () => {
  const router = useRouter();
  const [ cookies, setCookie, removeCookie ] = useCookies(['accessToken', 'username']);
  useEffect(()=>{
    removeCookie('accessToken');
    removeCookie('username');

    router.push(
      '/logout',
      '/logout'
    )
  })
  return (
    <Header />
  )
}

export default ReceiveToken;