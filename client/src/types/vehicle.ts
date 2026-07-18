export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: string;
  quantity: number;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}