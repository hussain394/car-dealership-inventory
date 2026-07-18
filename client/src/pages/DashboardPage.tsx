import { Navbar } from '../components/layout/Navbar';
import { VehicleList } from '../components/vehicles/VehicleList';

export const DashboardPage = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Available Vehicles</h1>
      <VehicleList />
    </main>
  </div>
);