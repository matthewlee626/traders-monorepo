import Users from '../models/user.model';

declare global {
  namespace Express {
    export interface User {
      email?: string;
      name?: string;
      gameChoice?: string;
      gameRoomId?: string;
      isAdmin?: boolean;
    }
  }
}

export const serializeUser = (user: any, done: (err: any, id?: unknown) => void) => {
  const payload = { email: user._json.email, name: user._json.name };
  done(null, payload);
};

export const deserializeUser = async (
  user: Express.User,
  done: (err: any, user?: false | Express.User | null | undefined) => void,
) => {
  const modifiedUser = await Users.findOne({ email: user.email });
  done(null, modifiedUser);
};
