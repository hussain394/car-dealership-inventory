import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehiclesApi';
import type { VehicleFilters } from '../types/vehicle';

export const useVehicles = (filters?: VehicleFilters) => {
  const hasFilters = filters && Object.values(filters).some((v) => v !== undefined && v !== '');

  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => (hasFilters ? vehiclesApi.search(filters!) : vehiclesApi.list()).then((r) => r.data),
  });
};
