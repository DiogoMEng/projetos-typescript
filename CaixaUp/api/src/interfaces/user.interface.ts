import { JwtPayload } from "jsonwebtoken";

export interface User {
  userId?: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export type AuthCredentials = Pick<User, "email" | "password">