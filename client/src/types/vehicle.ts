export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: string;
  quantity: number;
  image_url: string | null;

}

export interface VehicleFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}
