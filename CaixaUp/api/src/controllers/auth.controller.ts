import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

const authService = new AuthService();

class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const login = await authService.login({ email, password });
    res.status(200).json(login);
  });
}

export default new AuthController();