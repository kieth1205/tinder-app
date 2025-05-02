import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  birthday?: string;
  gender?: string;
  images?: string[];
  interests?: string[];
  rawProfile?: string;
  lookingFor?: string;
  zodiac?: string;
  education?: string;
  loveLanguage?: string;
  pet?: string;
  alcoholConsumption?: string;
  smoking?: string;
  exerciseHabit?: string;
  diet?: string;
  socialMediaActivity?: string;
  sleepHabit?: string;
  communicationStyle?: string;
  preferredDistance?: number;
  
  isVip?: boolean;
  balance?: number; // Số tiền hiện có
  vipExpireDate?: string; // Ngày hết hạn VIP
}

export interface UpdateProfileDto {
  name?: string;
  birthday?: Date;
  gender?: string;
  images?: string[];
  interests?: string[];
  rawProfile?: string;
  lookingFor?: string;
  zodiac?: string;
  education?: string;
  loveLanguage?: string;
  pet?: string;
  alcoholConsumption?: string;
  smoking?: string;
  exerciseHabit?: string;
  diet?: string;
  socialMediaActivity?: string;
  sleepHabit?: string;
  communicationStyle?: string;
  preferredDistance?: number;
}

const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/users/profile', {
        requireAuth: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(updateData: UpdateProfileDto): Promise<User> {
    try {
      const response = await api.patch('/users/profile', updateData, {
        requireAuth: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Upload user photos
   */
  async uploadPhotos(files: any[]): Promise<{ urls: string[] }> {
    try {
      const response = await api.upload<{ urls: string[] }>(
        "/upload/multiple",
        files,
        { fieldName: 'files', requireAuth: true }
      );
      
      if (response.error) {
        throw new Error(`Upload failed: ${response.error}`);
      }
      
      if (!response.data || !response.data.urls) {
        throw new Error('Không nhận được dữ liệu từ server hoặc dữ liệu không hợp lệ');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    }
  }
};

export default userService;
