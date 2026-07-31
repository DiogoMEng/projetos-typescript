import { Request, Response } from 'express';
import AuthService from '#services/auth.service.js';
import { catchAsync } from '#utils/catchAsync.js';
import { BadRequestError } from '#errors/httpErrors.js';

const authService = new AuthService();

class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email e senha são obrigatórios');
    }

    const login = await authService.login({ email, password });
    res.status(200).json(login);
  });
}

export default new AuthController();