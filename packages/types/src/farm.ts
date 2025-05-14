// packages/types/src/farm.ts
export interface Coordinate {
    latitude: number;
    longitude: number;
  }
  
  export interface Farm {
    id: string;
    name: string;
    cropName: string;
    variety: string;
    acreage: number;
    sowingDate: string;
    watering: 'Irrigated' | 'Rainfed';
    coordinates: Coordinate[];
    soilType?: string;
    location?: string;
    cropAge?: number; // in days
  }
  
  export interface FarmFormValues {
    name: string;
    cropName: string;
    variety: string;
    sowingDate: string;
    watering: 'Irrigated' | 'Rainfed';
  }