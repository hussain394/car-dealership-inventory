import { vehiclesRepository } from './vehicles.repository';
import { ApiError } from '../../utils/apiError';
import { CreateVehicleInput, UpdateVehicleInput, SearchVehicleInput } from './vehicles.schema';

export const vehiclesService = {
  create: (input: CreateVehicleInput) => vehiclesRepository.create(input),

  list: () => vehiclesRepository.findAll(),

  search: (filters: SearchVehicleInput) => vehiclesRepository.search(filters),

  update: async (id: number, input: UpdateVehicleInput) => {
    const updated = await vehiclesRepository.update(id, input);
    if (!updated) throw new ApiError(404, 'Vehicle not found');
    return updated;
  },

  remove: async (id: number) => {
    const deleted = await vehiclesRepository.delete(id);
    if (!deleted) throw new ApiError(404, 'Vehicle not found');
  },

  purchase: async (id: number) => {
    const updated = await vehiclesRepository.decrementQuantity(id);
    if (updated) return updated;

    // Decrement failed — figure out why: not found, or out of stock.
    const existing = await vehiclesRepository.findById(id);
    if (!existing) throw new ApiError(404, 'Vehicle not found');
    throw new ApiError(409, 'Vehicle is out of stock');
  },

  restock: async (id: number, amount: number) => {
    if (amount <= 0) throw new ApiError(400, 'Restock amount must be positive');
    const updated = await vehiclesRepository.incrementQuantity(id, amount);
    if (!updated) throw new ApiError(404, 'Vehicle not found');
    return updated;
  },
};
