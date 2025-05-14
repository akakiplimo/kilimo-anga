// apps/mobile/services/auth.ts
import api from './api';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse } from '../../../packages/types/src';

export const register = async (data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}): Promise<void> => {
  try {
    await api.post('/auth/register', data);
  } catch (error) {
    const err = error as any;
    console.error('Registration error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Registration failed');
  }
};

export const requestOTP = async (phoneNumber: string): Promise<void> => {
  try {
    await api.post('/auth/request-otp', { phoneNumber });
  } catch (error) {
    const err = error as any;
    console.error('OTP request error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOTP = async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
    const { token, user } = response.data;
    
    // Store the token
    await SecureStore.setItemAsync('authToken', token);
    
    return { token, user };
  } catch (error) {
    const err = error as any;
    console.error('OTP verification error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Invalid OTP');
  }
};