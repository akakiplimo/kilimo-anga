// apps/mobile/services/farm.ts
import api from './api';
import { Farm, FarmFormValues, Coordinate } from '../../../packages/types/src';

export const getFarms = async (): Promise<Farm[]> => {
  try {
    const response = await api.get('/farms');
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error('Error fetching farms:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch farms');
  }
};

export const getFarmById = async (id: string): Promise<Farm> => {
  try {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error('Error fetching farm details:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to fetch farm details');
  }
};

export const createFarm = async (farmData: FarmFormValues & { acreage: number; coordinates: Coordinate[] }): Promise<Farm> => {
  try {
    const response = await api.post('/farms', farmData);
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error('Error creating farm:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to create farm');
  }
};

export const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
  try {
    const response = await api.put(`/farms/${id}`, farmData);
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error('Error updating farm:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to update farm');
  }
};

export const deleteFarm = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/farms/${id}`);
    return true;
  } catch (error) {
    const err = error as any;
    console.error('Error deleting farm:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to delete farm');
  }
};