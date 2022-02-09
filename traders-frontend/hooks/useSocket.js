import { useEffect, useState } from 'react'
import io from 'socket.io-client'


export default function useSocket(userToken) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.BACKEND_ROUTE, {
      auth: {token: userToken}
    });
    setSocket(newSocket);
    return () => socket.close();
  }, [socket, userToken])

  return {socket}
}