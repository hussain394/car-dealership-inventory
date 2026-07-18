import { query } from '../../config/db';
import { CreateVehicleInput, UpdateVehicleInput, SearchVehicleInput } from './vehicles.schema';

export interface VehicleRecord {
  id: number;
  make: string;
  model: string;
  category: string;
  price: string;
  quantity: number;
  image_url: string | null;

}

export const vehiclesRepository = {
  create: async (input: CreateVehicleInput): Promise<VehicleRecord> => {
  const result = await query(
    `INSERT INTO vehicles (make, model, category, price, quantity, image_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [input.make, input.model, input.category, input.price, input.quantity, input.image_url || null]
  );
  return result.rows[0];
},

  findAll: async (): Promise<VehicleRecord[]> => {
    const result = await query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows;
  },

  findById: async (id: number): Promise<VehicleRecord | null> => {
    const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  search: async (filters: SearchVehicleInput): Promise<VehicleRecord[]> => {
    const clauses: string[] = [];
    const values: unknown[] = [];

    if (filters.make) {
      values.push(`%${filters.make}%`);
      clauses.push(`make ILIKE $${values.length}`);
    }
    if (filters.model) {
      values.push(`%${filters.model}%`);
      clauses.push(`model ILIKE $${values.length}`);
    }
    if (filters.category) {
      values.push(`%${filters.category}%`);
      clauses.push(`category ILIKE $${values.length}`);
    }
    if (filters.minPrice !== undefined) {
      values.push(filters.minPrice);
      clauses.push(`price >= $${values.length}`);
    }
    if (filters.maxPrice !== undefined) {
      values.push(filters.maxPrice);
      clauses.push(`price <= $${values.length}`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await query(`SELECT * FROM vehicles ${where} ORDER BY created_at DESC`, values);
    return result.rows;
  },

  update: async (id: number, input: UpdateVehicleInput): Promise<VehicleRecord | null> => {
    const fields = Object.keys(input) as (keyof UpdateVehicleInput)[];
    if (fields.length === 0) return vehiclesRepository.findById(id);

    const setClauses = fields.map((field, i) => `${field} = $${i + 1}`);
    const values = fields.map((field) => input[field]);

    const result = await query(
      `UPDATE vehicles SET ${setClauses.join(', ')}, updated_at = now()
       WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0] ?? null;
  },

  delete: async (id: number): Promise<boolean> => {
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  // Atomic: only decrements if quantity > 0, in a single round trip.
  decrementQuantity: async (id: number): Promise<VehicleRecord | null> => {
    const result = await query(
      `UPDATE vehicles SET quantity = quantity - 1, updated_at = now()
       WHERE id = $1 AND quantity > 0 RETURNING *`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  incrementQuantity: async (id: number, amount: number): Promise<VehicleRecord | null> => {
    const result = await query(
      `UPDATE vehicles SET quantity = quantity + $2, updated_at = now()
       WHERE id = $1 RETURNING *`,
      [id, amount]
    );
    return result.rows[0] ?? null;
  },
};
