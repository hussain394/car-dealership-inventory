import { apiClient } from './apiClient';
import type { Vehicle, VehicleFilters, VehicleInput } from '../types/vehicle';

export const vehiclesApi = {
  list: () => apiClient.get<Vehicle[]>('/vehicles'),

  search: (filters: VehicleFilters) => apiClient.get<Vehicle[]>('/vehicles/search', { params: filters }),

  create: (data: VehicleInput) => apiClient.post<Vehicle>('/vehicles', data),

  update: (id: number, data: Partial<VehicleInput>) =>
    apiClient.put<Vehicle>(`/vehicles/${id}`, data),

  remove: (id: number) => apiClient.delete(`/vehicles/${id}`),

  purchase: (id: number) => apiClient.post<Vehicle>(`/vehicles/${id}/purchase`),

  restock: (id: number, amount: number) =>
    apiClient.post<Vehicle>(`/vehicles/${id}/restock`, { amount }),
};