import io from 'socket.io-client';
import {getUniversalCookies} from '../components/CookiesExporter'

const accessToken = getUniversalCookies().get('accessToken');

const socket = io(process.env.BACKEND_ROUTE, {
  withCredentials: false,
  auth: { token: `Bearer ${accessToken}` },
});

// response, error, connect_error, disconnect

export default socket;
