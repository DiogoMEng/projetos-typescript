import { Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { catchAsync } from 'utils/catchAsync';

const authService = new AuthService();

class AuthController {
  static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const login = await authService.login({ email, password });
    res.status(200).send(login);
  });
}

export default AuthController;