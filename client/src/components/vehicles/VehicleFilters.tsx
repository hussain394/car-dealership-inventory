import { useEffect, useState } from 'react';
import type { VehicleFilters as Filters } from '../../types/vehicle';
import { Input } from '../ui/Input';

interface VehicleFiltersProps {
  onChange: (filters: Filters) => void;
}

export const VehicleFilters = ({ onChange }: VehicleFiltersProps) => {
  const [make, setMake] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        make: make || undefined,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [make, category, minPrice, maxPrice, onChange]);

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
      <Input id="filter-make" label="Make" value={make} onChange={(e) => setMake(e.target.value)} />
      <Input id="filter-category" label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input
        id="filter-min-price"
        label="Min price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <Input
        id="filter-max-price"
        label="Max price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>
  );
};
