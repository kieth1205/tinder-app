import api from './api';
import { User } from './userService';

export const getUsersByInterest = async (
  interestId: string,
): Promise<User[]> => {
  try {
    const response = await api.get<{ users: User[] }>(`matches/by-interest?interestId=${interestId}`, {
      requireAuth: true,
    });

    if (response.error) {
      console.error('Error fetching users by interest:', response.error);
      throw new Error(response.error);
    }

    return response.data?.users || [];
  } catch (error) {
    console.error('Error in getUsersByInterest service:', error);
    throw error;
  }
};

export const getAllInterests = async () => {
  try {
    const response = await api.get('interests', {
      requireAuth: true
    });

    if (response.error) {
      console.error('Error fetching all interests:', response.error);
      throw new Error(response.error);
    }

    return response.data?.interests || [];
  } catch (error) {
    console.error('Error in getAllInterests service:', error);
    throw error;
  }
};

export const addUserInterests = async (interestIds: string[]) => {
  try {
    const response = await api.post('user/interests', { interestIds }, {
      requireAuth: true
    });

    if (response.error) {
      console.error('Error adding user interests:', response.error);
      throw new Error(response.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error in addUserInterests service:', error);
    throw error;
  }
};

export const removeUserInterests = async (interestIds: string[]) => {
  try {
    const response = await api.delete(`user/interests`, {
      headers: {
        'Interest-Ids': interestIds.join(','),
      },
      requireAuth: true
    });

    if (response.error) {
      console.error('Error removing user interests:', response.error);
      throw new Error(response.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error in removeUserInterests service:', error);
    throw error;
  }
};
