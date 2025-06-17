import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";
import { AuthenticatedUser } from "../interfaces/user.protocol";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  const token = authorization!.split(" ")[1];

  try {
    if (!token) {
      res.status(401).json({ message: "Olá! Para acessar essa área, é necessário estar logado. Faça seu login ou registre-se em poucos segundos!" });
      return;
    }

    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as { id: number };
    const user = await User.findByPk(id);

    if (!user) {
      res.status(401).json({ message: "Olá! Para acessar essa área, é necessário estar logado. Faça seu login ou registre-se em poucos segundos! Usuário" });
      return;
    }

    const userData = user.toJSON ? user.toJSON() : JSON.parse(JSON.stringify(user));
    const { password, ...loggedUser } = userData;

    req.user = loggedUser as AuthenticatedUser;

    next();
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
