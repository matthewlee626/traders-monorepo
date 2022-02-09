import axios, { AxiosError } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import Users from '../models/user.model';

const { AUTH0_DOMAIN } = process.env;
if (!AUTH0_DOMAIN) {
  throw console.error('AUTH0_DOMAIN not in .env');
}

export const secured = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return next();
    }

    if (req.headers.authorization) {
      const accessToken = req.headers.authorization;
      var response;
      try {
        response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `${accessToken}` },
        });
        req.user = (await Users.findOne({ email: response.data.email })) as Express.User;
      } catch (err: unknown | AxiosError) {
        console.error(err);
        if (axios.isAxiosError(err)) {
          req.session.returnTo = req.originalUrl;
          res.redirect('/user/login');
          return;
        }
      }
      return next();
    }

    req.session.returnTo = req.originalUrl;
    res.redirect('/user/login');
  };
};

export const socketsecured = async (socket: Socket, next: Function) => {
  // authentication middleware
  const accessToken = socket.handshake.auth.token;

  let req = socket.request as any;
  if (req.user) {
    next();
  } else if (accessToken) {
    var response;
    try {
      response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: { Authorization: `${accessToken}` },
      });
      req.user = (await Users.findOne({ email: response.data.email })) as Express.User;
    } catch (err: unknown | AxiosError) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        next(new Error('unauthorized'));
      }
    }
    next();
  } else {
    next(new Error('unauthorized'));
  }
};
