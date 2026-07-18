import { apiClient } from './apiClient';
import type { User } from '../types/user';

export const authApi = {
  register: (email: string, password: string) =>
    apiClient.post<User>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: User }>('/auth/login', { email, password }),
};