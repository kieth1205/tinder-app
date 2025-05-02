import api from './api';

export enum SwipeDirection {
  LEFT = 'LEFT',  // Dislike
  RIGHT = 'RIGHT', // Like
  UP = 'UP'       // Super like
}

interface SwipeResponse {
  match?: boolean; // Đánh dấu có match không
  otherUser?: any; // Thông tin người dùng đã match (nếu có)
  message?: string; // Thông báo
}

/**
 * Gửi swipe action đến server
 * @param targetUserId Id của người dùng được swipe
 * @param direction Hướng swipe (LEFT, RIGHT, UP)
 * @returns Response từ API
 */
export const createSwipe = async (targetUserId: string, direction: SwipeDirection): Promise<SwipeResponse> => {
  try {
    const response = await api.post<SwipeResponse>('matches/swipe', {
      targetUserId,
      direction
    });
    
    if (response.error) {
      console.error('Swipe error:', response.error);
      return { message: response.error };
    }
    
    return response.data || { message: 'Swipe successfully' };
  } catch (error) {
    console.error('Error creating swipe:', error);
    return { message: 'Failed to swipe' };
  }
};

export default {
  createSwipe
};
