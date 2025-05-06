import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import User from "../database/models/User";

// Define a type for the authenticated user (excluding password)
type AuthenticatedUser = {
  id: number;
  // Add other user properties here
  [key: string]: any;
};

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Acesso não Autorizado");
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as { id: number };

    const user = await User.findByPk(id);

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }

    // Safely remove password from user object
    const userData = user.toJSON ? user.toJSON() : JSON.parse(JSON.stringify(user));
    const { password, ...loggedUser } = userData;

    // Assign the user data to req.user
    req.user = loggedUser as AuthenticatedUser;

    next();
  } catch (error) {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
};
