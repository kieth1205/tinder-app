import api from './api';
import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const locationService = {
  /**
   * Lấy vị trí hiện tại của người dùng
   */
  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      // Kiểm tra quyền truy cập vị trí
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return null;
      }

      // Lấy vị trí hiện tại
      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },

  /**
   * Cập nhật vị trí người dùng lên server
   */
  async updateUserLocation(coordinates: Coordinates): Promise<boolean> {
    try {
      const response = await api.patch('/users/location', coordinates, {
        requireAuth: true
      });
      return response.error === null;
    } catch (error) {
      console.error('Error updating user location:', error);
      return false;
    }
  },
};

export default locationService;
