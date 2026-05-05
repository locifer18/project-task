import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AppJwtPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const createToken = (payload: AppJwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): AppJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as AppJwtPayload;
};
