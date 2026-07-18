import { apiClient } from './apiClient';
import type { Vehicle, VehicleFilters } from '../types/vehicle';

export const vehiclesApi = {
  list: () => apiClient.get<Vehicle[]>('/vehicles'),

  search: (filters: VehicleFilters) => apiClient.get<Vehicle[]>('/vehicles/search', { params: filters }),

  create: (data: Omit<Vehicle, 'id'>) => apiClient.post<Vehicle>('/vehicles', data),

  update: (id: number, data: Partial<Omit<Vehicle, 'id'>>) =>
    apiClient.put<Vehicle>(`/vehicles/${id}`, data),

  remove: (id: number) => apiClient.delete(`/vehicles/${id}`),

  purchase: (id: number) => apiClient.post<Vehicle>(`/vehicles/${id}/purchase`),

  restock: (id: number, amount: number) =>
    apiClient.post<Vehicle>(`/vehicles/${id}/restock`, { amount }),
};