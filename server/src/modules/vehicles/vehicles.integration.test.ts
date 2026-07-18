import request from 'supertest';
import { app } from '../../app';
import { pool } from '../../config/db';
import { resetDb } from '../../test-utils/resetDb';

let userToken: string;
let adminToken: string;

const registerAndLogin = async (email: string, password: string) => {
  await request(app).post('/api/auth/register').send({ email, password });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token as string;
};

const promoteToAdmin = async (email: string) => {
  await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
};

beforeEach(async () => {
  await resetDb();
  userToken = await registerAndLogin('user@example.com', 'SuperSecret1');

  await registerAndLogin('admin@example.com', 'SuperSecret1');
  await promoteToAdmin('admin@example.com');
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'SuperSecret1' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await pool.end();
});

const createSampleVehicle = () =>
  request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 28500, quantity: 2 });

describe('vehicles endpoints', () => {
  it('rejects unauthenticated create', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send({ make: 'Toyota', model: 'Camry', category: 'Sedan', price: 28500, quantity: 2 });
    expect(res.status).toBe(401);
  });

  it('allows an authenticated user to list vehicles', async () => {
    await createSampleVehicle();
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('lets a non-admin purchase but not delete', async () => {
    const created = await createSampleVehicle();
    const id = created.body.id;

    const purchase = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(purchase.status).toBe(200);
    expect(purchase.body.quantity).toBe(1);

    const del = await request(app)
      .delete(`/api/vehicles/${id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(del.status).toBe(403);
  });

  it('returns 409 when purchasing out-of-stock vehicle', async () => {
    const created = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ make: 'Honda', model: 'CR-V', category: 'SUV', price: 31500, quantity: 0 });

    const res = await request(app)
      .post(`/api/vehicles/${created.body.id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(409);
  });

  it('lets an admin restock and a user cannot', async () => {
    const created = await createSampleVehicle();
    const id = created.body.id;

    const forbidden = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 });
    expect(forbidden.status).toBe(403);

    const ok = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    expect(ok.status).toBe(200);
    expect(ok.body.quantity).toBe(7);
  });

  it('searches by make and price range', async () => {
    await createSampleVehicle();
    const res = await request(app)
      .get('/api/vehicles/search?make=Toyota&minPrice=20000&maxPrice=30000')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
