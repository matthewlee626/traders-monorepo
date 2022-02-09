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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import axios from 'axios';

import Layout from '../../components/Layout';
import { useCookies } from 'react-cookie';

const Admin = () => {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['accessToken']);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  useEffect(() => {
    if ( !cookies.accessToken  ) {
      router.push('/login')
    }
  }, [cookies.accessToken, router]);

  useEffect(() => {}, []);

  let requestAccess = async () => {
    try {
      let response = await axios.post(
        process.env.BACKEND_ROUTE + '/user/admin',
        {
          adminPasscode: password,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.accessToken}`,
          },
        },
      );
      alert('Successfully gained access!');
    } catch (err) {
      alert('Failed to gained access!');
    }
  };

  return (
    <Layout>
      <Container mt={2}>
        <Center>
          <Text fontSize='4xl'>Request Admin</Text>
        </Center>
        <FormControl mt={2}>
          <Input
            id='password'
            placeholder='Password'
            type='password'
            value={password}
            onChange={handleChange}
          />
          <Center>
            <Button mt={2} colorScheme='teal' onClick={requestAccess}>
              Submit
            </Button>
          </Center>
        </FormControl>
      </Container>
    </Layout>
  );
};

export default Admin;
