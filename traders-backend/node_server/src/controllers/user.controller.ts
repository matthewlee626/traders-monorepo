import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import url from 'url';
import Users from '../models/user.model';

declare module 'express-session' {
  export interface Session {
    returnTo: any;
    accessToken: string;
    passport: { user: any };
  }
}

const { ADMIN_PASSCODE, FRONT_END_DOMAIN } = process.env;
if (!ADMIN_PASSCODE || !FRONT_END_DOMAIN) {
  throw console.error('ADMIN_PASSCODE not in .env');
}

export const login_callback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('auth0', (err, user, accessToken) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/user/login');
    }
    req.logIn(user, async (err: Error) => {
      if (err) {
        return next(err);
      }
      // const returnTo: string = req.session.returnTo;
      delete req.session.returnTo;
      const { name, email } = user._json;
      await Users.updateOne({ email }, { name, email }, { upsert: true });
      res.redirect(`${FRONT_END_DOMAIN}?accessToken=${accessToken}&username=${email}`);
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  const port = req.socket.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  const logoutURL = new url.URL(FRONT_END_DOMAIN);
  var searchString = { client_id: process.env.AUTH0_CLIENT_ID, returnTo: returnTo }.toString();
  logoutURL.search = searchString;
  res.redirect(logoutURL.origin);
};

export const getUser = async (req: Request, res: Response) => {
  // we can guaranteed that the user is logged in based on the secured function on the route
  // therefore no need to check whether the user is logged in
  if (!req.user) {
    res.status(500).json({
      error: "req.user doesn't have the user",
    });
    return;
  }
  var { name, email } = req.user;
  res.status(200).json({ name, email });
};

export const makeAdmin = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(500).json({
      error: "req.user doesn't have the user",
    });
    return;
  }
  const { adminPasscode } = req.body;
  if (adminPasscode !== ADMIN_PASSCODE) {
    res.status(400).json({ error: 'Admin Passcode is incorrect' });
    return;
  }

  const { email } = req.user;
  await Users.updateOne({ email }, { isAdmin: true });
  res.status(200).json({ success: 'successfully identified as an admin' });
};

export const isAdmin = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(500).json({
      error: "req.user doesn't have the user",
    });
    return;
  }
  const { isAdmin } = req.user;
  if (isAdmin) {
    res.status(200).json({ success: 'This person is an admin', isAdmin: true });
    return;
  } else {
    res.status(400).json({ isAdmin: false, error: 'This person is not an admin' });
    return;
  }
};
