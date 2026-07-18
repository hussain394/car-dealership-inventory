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

  const totalModels = vehicles?.length ?? 0;
  const totalUnits = vehicles?.reduce((sum, v) => sum + v.quantity, 0) ?? 0;
  const outOfStockCount = vehicles?.filter((v) => v.quantity === 0).length ?? 0;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-6 border-b border-steel/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-500">Inventory ledger</p>
            <h1 className="font-display text-3xl font-semibold text-ink">Manage the Lot</h1>
          </div>
          <Button onClick={() => setEditing('new')}>Add vehicle</Button>
        </div>

        {/* Quick stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-steel/15 bg-white px-4 py-3">
            <p className="font-mono text-2xl font-semibold text-ink">{totalModels}</p>
            <p className="text-xs uppercase tracking-wide text-steel">Models listed</p>
          </div>
          <div className="rounded-lg border border-steel/15 bg-white px-4 py-3">
            <p className="font-mono text-2xl font-semibold text-ink">{totalUnits}</p>
            <p className="text-xs uppercase tracking-wide text-steel">Units on lot</p>
          </div>
          <div className="rounded-lg border border-steel/15 bg-white px-4 py-3">
            <p className={`font-mono text-2xl font-semibold ${outOfStockCount > 0 ? 'text-rust-500' : 'text-ink'}`}>
              {outOfStockCount}
            </p>
            <p className="text-xs uppercase tracking-wide text-steel">Sold out</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}

        {!isLoading && totalModels === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-steel/30 bg-white py-16 text-center">
            <p className="font-display text-lg text-ink">No vehicles on the lot yet</p>
            <p className="text-sm text-steel">Add your first vehicle to get started.</p>
          </div>
        )}

        {!isLoading && totalModels > 0 && (
          <div className="overflow-hidden rounded-lg border border-steel/15 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-steel/15 bg-paper text-xs uppercase tracking-wide text-steel">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">On lot</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles?.map((v) => (
                  <tr key={v.id} className="border-t border-steel/10 hover:bg-paper/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                          {v.image_url ? (
                            <img
                              src={v.image_url}
                              alt={`${v.make} ${v.model}`}
                              className="h-full w-full scale-110 object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-wide text-steel">
                              No image
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-ink">
                          {v.make} {v.model}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-steel">{v.category}</td>
                    <td className="px-4 py-3 font-mono text-ink">₹{Number(v.price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${
                          v.quantity === 0 ? 'bg-rust-50 text-rust-500' : 'bg-moss-50 text-moss-600'
                        }`}
                      >
                        {v.quantity}
                      </span>
                    </td>
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
        )}
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
