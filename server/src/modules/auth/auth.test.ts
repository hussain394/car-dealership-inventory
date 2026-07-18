import { authService } from './auth.service';
import { authRepository } from './auth.repository';
import { ApiError } from '../../utils/apiError';

jest.mock('./auth.repository');
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
}));

const mockedRepo = authRepository as jest.Mocked<typeof authRepository>;
const bcrypt = require('bcrypt');

describe('authService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a new user when the email is not taken', async () => {
    mockedRepo.findByEmail.mockResolvedValue(null);
    mockedRepo.create.mockResolvedValue({
      id: 1,
      email: 'jane@example.com',
      password_hash: 'hashed-password',
      role: 'user',
    });

    const result = await authService.register({
      email: 'jane@example.com',
      password: 'SuperSecret1',
    });

    expect(mockedRepo.create).toHaveBeenCalledWith('jane@example.com', 'hashed-password');
    expect(result).toEqual({ id: 1, email: 'jane@example.com', role: 'user' });
    expect(result).not.toHaveProperty('password_hash');
  });

  it('rejects registration when the email already exists', async () => {
    mockedRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: 'jane@example.com',
      password_hash: 'x',
      role: 'user',
    });

    await expect(
      authService.register({ email: 'jane@example.com', password: 'SuperSecret1' })
    ).rejects.toThrow(ApiError);
  });
});

describe('authService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a token when credentials are valid', async () => {
    mockedRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: 'jane@example.com',
      password_hash: 'hashed-password',
      role: 'user',
    });
    bcrypt.compare.mockResolvedValue(true);

    const result = await authService.login({
      email: 'jane@example.com',
      password: 'SuperSecret1',
    });

    expect(result.token).toBe('fake-jwt-token');
  });

  it('rejects login when the password is wrong', async () => {
    mockedRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: 'jane@example.com',
      password_hash: 'hashed-password',
      role: 'user',
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({ email: 'jane@example.com', password: 'wrong' })
    ).rejects.toThrow(ApiError);
  });

  it('rejects login when the email is unknown', async () => {
    mockedRepo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'nobody@example.com', password: 'whatever' })
    ).rejects.toThrow(ApiError);
  });
});
