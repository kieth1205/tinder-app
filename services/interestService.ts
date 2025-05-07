import api from './api';
import { User } from './userService';

export const getUsersByInterest = async (
  interestId: string,
): Promise<User[]> => {
  try {
    const response = await api.get(`suggestions/by-interest?interestId=${interestId}`, {
      requireAuth: true,
    });

    if (response.error) {
      console.error('Error fetching users by interest:', response.error);
      throw new Error(response.error);
    }
    return response.data || [];
  } catch (error) {
    console.error('Error in getUsersByInterest service:', error);
    throw error;
  }
};

