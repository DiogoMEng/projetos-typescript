import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { JwtPayload } from "../interfaces/user.protocol";
import { userRepository } from "../Repositories/userRepository";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError('Acesso não autorizado');
    }

    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;

    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestError('E-mail ou senha inválidos');
    }

    const { password: _, ...loggedUser } = user;

    req.user = loggedUser

    next();
}