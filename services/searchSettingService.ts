import api from './api';
import { Gender } from '@/types';

export interface SearchSetting {
  id: string;
  userId: string;
  ageRange: number[]; // [minAge, maxAge]
  gender?: Gender; // Giới tính mong muốn
  preferredDistance?: number; // Khoảng cách mong muốn
  hasBio?: boolean; // Có tiểu sử không
  lastUpdated: string;
}

export interface UpdateSearchSettingDto {
  ageRange?: number[];
  gender?: Gender;
  preferredDistance?: number;
  hasBio?: boolean;
}

const searchSettingService = {
  /**
   * Get current user's search settings
   */
  async getSearchSettings(): Promise<SearchSetting> {
    try {
      const response = await api.get('/search-settings', {
        requireAuth: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching search settings:', error);
      throw error;
    }
  },

  /**
   * Update search settings
   */
  async updateSearchSettings(updateData: UpdateSearchSettingDto): Promise<SearchSetting> {
    try {
      const response = await api.patch('/search-settings', updateData, {
        requireAuth: true
      });      
      return response.data;
    } catch (error) {
      console.error('Error updating search settings:', error);
      throw error;
    }
  },
};

export default searchSettingService;
