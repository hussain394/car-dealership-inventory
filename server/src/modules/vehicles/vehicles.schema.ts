import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const searchVehicleSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type SearchVehicleInput = z.infer<typeof searchVehicleSchema>;
