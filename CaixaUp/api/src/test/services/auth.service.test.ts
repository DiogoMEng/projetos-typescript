import {
  describe, expect, it, jest, beforeEach,
} from '@jest/globals';
import { UserModel } from '../../database/models/User.model.js';

const mockFindOne = jest.fn<() => Promise<Partial<UserModel> | null>>();
const mockCompare = jest.fn<() => Promise<boolean>>();
const mockSign = jest.fn<() => string>();

await jest.unstable_mockModule('../../database/models', () => ({
  DB: {
    Users: { findOne: mockFindOne },
  },
}));
await jest.unstable_mockModule('bcryptjs', () => ({
  default: { compare: mockCompare },
  compare: mockCompare,
}));
await jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: mockSign },
}));

const { default: AuthService } = await import('../../services/auth.service.js');

describe('Testing the Authentication service', () => {
  let authService: InstanceType<typeof AuthService>;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  it('should generate a valid JWT token upon receiving correct credentials', async () => {
    const mockUser = {
      userId: '123',
      email: 'test@gmail.com',
      password: 'hashed_password',
      name: 'User Test',
    };
    const loginData = {
      email: 'test@gmail.com',
      password: 'hashed_password',
    };

    mockFindOne.mockResolvedValue(mockUser);
    mockCompare.mockResolvedValue(true);
    mockSign.mockReturnValue('mocked_jwt_token');

    const result = await authService.login(loginData);

    expect(mockFindOne).toHaveBeenCalledWith({
      attributes: ['userId', 'email', 'password'],
      where: { email: loginData.email },
    });
    expect(mockCompare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(result).toHaveProperty('accessToken', 'mocked_jwt_token');
  });

  it('should throw when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'notfound@gmail.com', password: '123' }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw when password does not match', async () => {
    mockFindOne.mockResolvedValue({
      userId: '123',
      email: 'test@gmail.com',
      password: 'hashed_password',
    });
    mockCompare.mockResolvedValue(false);

    await expect(
      authService.login({ email: 'test@gmail.com', password: 'arong_password' }),
    ).rejects.toThrow('Senha incorreta');
  });
});