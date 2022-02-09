import { Button, Container, FormControl, Select, Text, Center, Textarea, Input } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import socket from '../../../utils/utils'
import { emitAction } from '../../../utils/sockets'

import Layout from '../../../components/Layout'

const GameB = () => {
  const [cookies, setCookies] = useCookies(['accessToken']);
  const router = useRouter();


  useEffect(() => {
    if ( !cookies.accessToken  ) {
      router.push('/login')
    }
  }, [cookies.accessToken, router]);

  const [games, setGames] = useState(["No games to join"])

  useEffect(() => {
    console.log(socket)

    socket.on('sendGames', (res) => {
      setGames(res.games)
    })

    socket.emit('retrieveGames', {})
  }, [])

  return (
    <Layout>
      <Container>
        <Center>
          <Text fontSize="4xl" mt={2} mb={2}>Select a room</Text>
        </Center>

        <Formik
          initialValues={{ roomID: '' }}
          onSubmit={(values, actions) => {
            if (values.roomID!=''){
              router.push(`/games/gameNapa/room/[roomID]`, `/games/gameNapa/room/${values.roomID}`)
            }
            actions.setSubmitting(false)

          }}
        >
          {(props) => (
            <Form>
              <Field name="roomID">
                {({ field, form } : any) => (
                  <FormControl>
                    <Input {...field} id="roomID"    onChange={(e) =>
                      form.setFieldValue(field.name, e.target.value)
                    }>
                      {/* <option value={'none'}>-</option>
                      {games.map((game) => (
                        <option value={game} key={game}>{game}</option>
                      ))} */}
                    </Input>
                  </FormControl>
                )}
              </Field>

              <Center>
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  )
}

export default GameB
