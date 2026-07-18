import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useVehicles } from '../hooks/useVehicles';
import { vehiclesApi } from '../api/vehiclesApi';
import { type Vehicle } from '../types/vehicle';
import { Navbar } from '../components/layout/Navbar';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const AdminPage = () => {
  const { data: vehicles, isLoading } = useVehicles();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Vehicle | 'new' | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vehiclesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  const restockMutation = useMutation({
    mutationFn: (id: number) => vehiclesApi.restock(id, 5),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Manage Inventory</h1>
          <Button onClick={() => setEditing('new')}>Add vehicle</Button>
        </div>

        {isLoading && <Spinner />}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles?.map((v) => (
                <tr key={v.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {v.make} {v.model}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{v.category}</td>
                  <td className="px-4 py-3 text-slate-600">${Number(v.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{v.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setEditing(v)}>
                        Edit
                      </Button>
                      <Button variant="secondary" onClick={() => restockMutation.mutate(v.id)}>
                        +5 stock
                      </Button>
                      <Button variant="danger" onClick={() => deleteMutation.mutate(v.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add vehicle' : 'Edit vehicle'}
      >
        <VehicleForm
          initial={editing !== 'new' ? (editing as Vehicle) : undefined}
          onSuccess={() => setEditing(null)}
        />
      </Modal>
    </div>
  );
};