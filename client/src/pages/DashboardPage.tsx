import { Navbar } from '../components/layout/Navbar';
import { VehicleList } from '../components/vehicles/VehicleList';

export const DashboardPage = () => (
  <div className="min-h-screen bg-paper">
    <Navbar />
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex flex-col gap-1 border-b border-steel/15 pb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-500">Current inventory</p>
        <h1 className="font-display text-3xl font-semibold text-ink">Available Vehicles</h1>
        <p className="text-sm text-steel">Browse the lot, filter by make or price, and purchase in stock units.</p>
      </div>
      <VehicleList />
    </main>
  </div>
);