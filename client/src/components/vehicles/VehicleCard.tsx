import { type Vehicle } from '../../types/vehicle';
import { Button } from '../ui/Button';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: number) => void;
  isPurchasing?: boolean;
}

export const VehicleCard = ({ vehicle, onPurchase, isPurchasing }: VehicleCardProps) => {
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-slate-500">{vehicle.category}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            outOfStock ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'
          }`}
        >
          {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
        </span>
      </div>

      <p className="text-lg font-semibold text-slate-900">
        ${Number(vehicle.price).toLocaleString()}
      </p>

      <Button
        onClick={() => onPurchase(vehicle.id)}
        disabled={outOfStock}
        isLoading={isPurchasing}
        className="mt-auto"
      >
        {outOfStock ? 'Sold out' : 'Purchase'}
      </Button>
    </div>
  );
};
