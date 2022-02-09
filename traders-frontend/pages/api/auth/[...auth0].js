import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';

const afterCallback = async (req, res, session, state) => {
  const login = await fetch(`${process.env.BACKEND_ROUTE}/user/login`);
  return session;
};

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, { afterCallback });
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
