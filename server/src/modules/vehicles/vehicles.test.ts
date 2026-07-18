
import { vehiclesService } from './vehicles.service';
import { vehiclesRepository } from './vehicles.repository';
import { ApiError } from '../../utils/apiError';

jest.mock('./vehicles.repository');
const mockedRepo = vehiclesRepository as jest.Mocked<typeof vehiclesRepository>;

const sampleVehicle = {
  id: 1,
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: '28500.00',
  quantity: 5,
};

beforeEach(() => jest.clearAllMocks());

describe('vehiclesService.create', () => {
  it('creates a vehicle', async () => {
    mockedRepo.create.mockResolvedValue(sampleVehicle);
    const result = await vehiclesService.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 28500,
      quantity: 5,
    });
    expect(result).toEqual(sampleVehicle);
  });
});

describe('vehiclesService.update / delete', () => {
  it('throws 404 when updating a vehicle that does not exist', async () => {
    mockedRepo.update.mockResolvedValue(null);
    await expect(vehiclesService.update(999, { price: 100 })).rejects.toThrow(ApiError);
  });

  it('throws 404 when deleting a vehicle that does not exist', async () => {
    mockedRepo.delete.mockResolvedValue(false);
    await expect(vehiclesService.remove(999)).rejects.toThrow(ApiError);
  });
});

describe('vehiclesService.purchase', () => {
  it('decrements quantity on a successful purchase', async () => {
    mockedRepo.decrementQuantity.mockResolvedValue({ ...sampleVehicle, quantity: 4 });
    const result = await vehiclesService.purchase(1);
    expect(result.quantity).toBe(4);
  });

  it('throws a 409 conflict when quantity is already zero', async () => {
    mockedRepo.decrementQuantity.mockResolvedValue(null);
    mockedRepo.findById.mockResolvedValue({ ...sampleVehicle, quantity: 0 });
    await expect(vehiclesService.purchase(1)).rejects.toThrow(ApiError);
  });

  it('throws a 404 when the vehicle does not exist at all', async () => {
    mockedRepo.decrementQuantity.mockResolvedValue(null);
    mockedRepo.findById.mockResolvedValue(null);
    await expect(vehiclesService.purchase(999)).rejects.toThrow(ApiError);
  });
});

describe('vehiclesService.restock', () => {
  it('increments quantity', async () => {
    mockedRepo.incrementQuantity.mockResolvedValue({ ...sampleVehicle, quantity: 8 });
    const result = await vehiclesService.restock(1, 3);
    expect(result.quantity).toBe(8);
  });

  it('rejects a non-positive restock amount', async () => {
    await expect(vehiclesService.restock(1, 0)).rejects.toThrow(ApiError);
  });
});
