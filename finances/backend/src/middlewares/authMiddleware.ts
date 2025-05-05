import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { UnauthorizedError, BadRequestError } from '../errors';
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import User from "../database/models/User";

typescript

/**
 * Express middleware to authenticate requests using JWT.
 * Attaches the authenticated user (without password) to req.user.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Acesso não autorizado');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_PASS;
    if (!secret) {
      throw new UnauthorizedError('JWT secret not configured');
    }

    const payload = jwt.verify(token, secret) as { id: number };
    const user = await User.findByPk(payload.id);

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    // Exclude password from user object
    const { password, ...loggedUser } = user.get ? user.get() : user;
    req.user = loggedUser;

    next();
  } catch (err) {
    next(err);
  }
};
