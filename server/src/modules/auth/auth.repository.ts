import { query } from '../../config/db';

export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

export const authRepository = {
  findByEmail: async (email: string): Promise<UserRecord | null> => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  },

  create: async (email: string, passwordHash: string): Promise<UserRecord> => {
    const result = await query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, 'user')
       RETURNING id, email, password_hash, role`,
      [email, passwordHash]
    );
    return result.rows[0];
  },
};
