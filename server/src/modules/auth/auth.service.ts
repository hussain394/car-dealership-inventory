import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../utils/hashPassword';
import { generateToken } from '../../utils/generateToken';
import { ApiError } from '../../utils/apiError';
import { RegisterInput, LoginInput } from './auth.schema';

export const authService = {
  register: async (input: RegisterInput) => {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.create(input.email, passwordHash);

    return { id: user.id, email: user.email, role: user.role };
  },

  login: async (input: LoginInput) => {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const passwordMatches = await comparePassword(input.password, user.password_hash);
    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  },
};
