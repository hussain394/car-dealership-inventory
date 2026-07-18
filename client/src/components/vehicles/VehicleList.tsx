import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useVehicles } from '../../hooks/useVehicles';
import { vehiclesApi } from '../../api/vehiclesApi';
import type { VehicleFilters as Filters } from '../../types/vehicle';
import { VehicleCard } from './VehicleCard';
import { VehicleFilters } from './VehicleFilters';
import { Spinner } from '../ui/Spinner';
import { Toast } from '../ui/Toast';

export const VehicleList = () => {
  const [filters, setFilters] = useState<Filters>({});
  const { data: vehicles, isLoading, isError } = useVehicles(filters);
  const queryClient = useQueryClient();
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: (id: number) => {
      setPurchasingId(id);
      return vehiclesApi.purchase(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
    onError: (err: any) => setError(err.response?.data?.error ?? 'Purchase failed'),
    onSettled: () => setPurchasingId(null),
  });

  return (
    <div className="flex flex-col gap-4">
      <VehicleFilters onChange={setFilters} />

      {error && <Toast message={error} onDismiss={() => setError(null)} />}

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {isError && <p className="text-sm text-red-600">Failed to load vehicles. Please try again.</p>}

      {!isLoading && vehicles?.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-500">No vehicles match your filters.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vehicles?.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onPurchase={(id) => purchaseMutation.mutate(id)}
            isPurchasing={purchasingId === vehicle.id}
          />
        ))}
      </div>
    </div>
  );
};
