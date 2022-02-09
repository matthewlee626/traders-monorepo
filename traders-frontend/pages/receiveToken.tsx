import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';

const ReceiveToken = () => {
  const router = useRouter();
  const [ cookies, setCookie ] = useCookies(['accessToken', 'username']);
  useEffect(()=>{
    setCookie('accessToken', `${router.query.accessToken}`);
    setCookie('username', `${router.query.username}`);

    router.push(
      '/',
      '/'
    )
  })
  return (
    <Header />
  )
}

export default ReceiveToken;