import {
  describe, expect, it, jest, beforeEach,
} from '@jest/globals';
import AuthService from '../../services/auth.service.js';
import { UserModel } from '../../database/models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../database/models/User.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Testing the Authentication service', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  it('It should generate a valid JWT token upon receiving correct credentials.', async () => {
    const mockUser = {
      id: '123',
      email: 'test@gmail.com',
      password: 'hashed_password',
      name: 'User Test',
    };
    const loginData = {
      email: 'test@gmail.com',
      password: 'hashed_password',
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked_jwt_token');

    const result = await authService.login(loginData);

    expect(UserModel.findOne).toHaveBeenCalledWith({ where: { email: loginData.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(result).toHaveProperty('accessToken', 'mocked_jwt_token');
    expect(result.user).toHaveProperty('email', mockUser.email);
  });
});