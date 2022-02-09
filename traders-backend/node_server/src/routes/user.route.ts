import { Router } from 'express';
import passport from 'passport';
import {
  getUser,
  login_callback,
  logout,
  makeAdmin,
  isAdmin,
} from '../controllers/user.controller';
import { secured } from '../middleware/secured';

export default {
  route: '/user',
  router: () => {
    const router = Router();

    router.get('/', secured(), getUser);

    // Perform the login, after login Auth0 will redirect to callback
    router.get(
      '/login',
      passport.authenticate('auth0', { scope: 'openid email profile' }),
      (_req, res) => res.redirect('/'),
    );

    // Perform the final stage of authentication and redirect to previously requested URL or '/user'
    router.get('/callback', login_callback);

    // Perform session logout and redirect to homepage
    router.get('/logout', logout);

    // make the user an admin
    router.post('/admin', secured(), makeAdmin);

    router.get('/isAdmin', secured(), isAdmin);

    return router;
  },
};
