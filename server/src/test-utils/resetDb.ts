import { pool } from '../config/db';

// Wipes both tables and restarts identity sequences so each test starts clean.
export const resetDb = async () => {
  await pool.query('TRUNCATE TABLE vehicles, users RESTART IDENTITY CASCADE');
};