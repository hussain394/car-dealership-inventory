import type { Vehicle } from '../../types/vehicle';
import { Button } from '../ui/Button';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: number) => void;
  isPurchasing?: boolean;
}

export const VehicleCard = ({ vehicle, onPurchase, isPurchasing }: VehicleCardProps) => {
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="group overflow-hidden rounded-lg border border-steel/15 bg-white shadow-tag transition-transform hover:-translate-y-0.5">
      <div className="lot-tag-perf bg-white" />

      <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full scale-110 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-125"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-steel">
            No image
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-ink/40" />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-steel">{vehicle.category}</p>
            <h3 className="font-display text-lg font-semibold text-ink">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
              outOfStock ? 'bg-rust-50 text-rust-500' : 'bg-moss-50 text-moss-600'
            }`}
          >
            {outOfStock ? 'Sold out' : `${vehicle.quantity} on lot`}
          </span>
        </div>

        <p className="font-mono text-2xl font-semibold text-ink">
          ${Number(vehicle.price).toLocaleString()}
        </p>

        <Button onClick={() => onPurchase(vehicle.id)} disabled={outOfStock} isLoading={isPurchasing}>
          {outOfStock ? 'Sold out' : 'Purchase'}
        </Button>
      </div>
    </div>
  );
};
