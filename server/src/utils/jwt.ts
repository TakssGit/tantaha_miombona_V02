import jwt, {
  type SignOptions
} from "jsonwebtoken";

import {
  env
} from "../config/env.js";

export interface TokenPayload {
  id: number;
  username: string;
  fullName: string;
  role: string;
  mustChangePassword?: boolean;
}

export const createToken = (
  payload: TokenPayload
): string => {
  const options:
    SignOptions = {
      expiresIn:
        env.jwtExpiresIn as
          SignOptions["expiresIn"]
    };

  return jwt.sign(
    payload,
    env.jwtSecret,
    options
  );
};

export const verifyToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    env.jwtSecret
  ) as TokenPayload;
};
