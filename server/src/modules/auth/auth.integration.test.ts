
import request from 'supertest';
import { app } from '../../app';
import { pool } from '../../config/db';
import { resetDb } from '../../test-utils/resetDb';

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

describe('POST /api/auth/register', () => {
  it('registers a new user and returns 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@example.com', password: 'SuperSecret1' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('jane@example.com');
    expect(res.body.password_hash).toBeUndefined();
  });

  it('returns 409 for a duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@example.com', password: 'SuperSecret1' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@example.com', password: 'AnotherPass1' });

    expect(res.status).toBe(409);
  });

  it('returns 400 for an invalid payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in and returns a JWT', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@example.com', password: 'SuperSecret1' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'SuperSecret1' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@example.com', password: 'SuperSecret1' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'WrongPass1' });

    expect(res.status).toBe(401);
  });
});
