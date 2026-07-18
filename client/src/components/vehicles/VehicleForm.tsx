import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '../../api/vehiclesApi';
import { type Vehicle } from '../../types/vehicle';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Toast } from '../ui/Toast';

interface VehicleFormProps {
  initial?: Vehicle;
  onSuccess?: () => void;
}

export const VehicleForm = ({ initial, onSuccess }: VehicleFormProps) => {
  const queryClient = useQueryClient();
  const [make, setMake] = useState(initial?.make ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [price, setPrice] = useState(initial?.price ?? '');
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() ?? '');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { make, model, category, price: Number(price), quantity: Number(quantity) };
      return initial ? vehiclesApi.update(initial.id, payload) : vehiclesApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      onSuccess?.();
    },
    onError: (err: any) => setError(err.response?.data?.error ?? 'Failed to save vehicle'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
      <Input id="make" label="Make" value={make} onChange={(e) => setMake(e.target.value)} required />
      <Input id="model" label="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
      <Input id="category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <Input
        id="price"
        label="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <Input
        id="quantity"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <Button type="submit" isLoading={mutation.isPending}>
        {initial ? 'Save changes' : 'Add vehicle'}
      </Button>
    </form>
  );
};
