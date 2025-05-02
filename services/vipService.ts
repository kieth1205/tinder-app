import { VipPackage } from '@/constants/vipPackage';
import api from './api';

export interface LikedByUser {
  id: string;
  name: string;
  images: string[];
  timestamp: Date;
  age?: number;
  distance?: number;
}

export interface PopularUser {
  id: string;
  name: string;
  images: string[];
  likeCount: number;
  age?: number;
  distance?: number;
}

export interface DirectMessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
  amount: number;
}

export interface BalanceResponse {
  balance: number;
}

export interface VipStatusResponse {
  isVip: boolean;
  expireDate?: string;
}

class VipService {
  /**
   * Gửi tin nhắn trực tiếp cho một người dùng mà không cần match
   */
  async sendDirectMessage(receiverId: string, content: string): Promise<DirectMessageResponse> {
    try {
      const response = await api.post<DirectMessageResponse>('/vip/direct-message', {
        receiverId,
        content
      }, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || { success: false, error: 'Không nhận được phản hồi từ máy chủ' };
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn trực tiếp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định'
      };
    }
  }

  /**
   * Lấy danh sách người đã thích mình
   */
  async getLikedByUsers(): Promise<LikedByUser[]> {
    try {
      const response = await api.get<LikedByUser[]>('/vip/liked-by', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người đã thích:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách người được nhiều lượt thích nhất
   */
  async getPopularUsers(limit: number = 10): Promise<PopularUser[]> {
    try {
      const response = await api.get<PopularUser[]>(`/vip/popular-users?limit=${limit}`, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người nổi bật:', error);
      return [];
    }
  }

  /**
   * Kiểm tra trạng thái VIP của người dùng hiện tại
   */
  async checkVipStatus(): Promise<boolean> {
    try {
      const response = await api.get<{ isVip: boolean }>('/vip/status', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.isVip || false;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái VIP:', error);
      return false;
    }
  }

  /**
 * Mua gói VIP
 */
  async purchaseVip(packageId: string): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>('/vip/subscribe', {
        packageId
      }, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        success: true,
        error: undefined,
        amount: response?.data?.amount || 0,
      };
    } catch (error) {
      console.error('Lỗi khi mua gói VIP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        amount: 0,
      };
    }
  }

  /**
   * Nạp tiền vào tài khoản
   */
  async depositMoney(amount: number): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>('/payment/deposit', {
        amount
      }, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        success: true,
        error: undefined,
        amount: response?.data?.amount || 0,
      };
    } catch (error) {
      console.error('Lỗi khi nạp tiền:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        amount: 0,
      };
    }
  }

  /**
   * Lấy số dư tài khoản
   */
  async getBalance(): Promise<number> {
    try {
      const response = await api.get<BalanceResponse>('/users/balance', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.balance || 0;
    } catch (error) {
      console.error('Lỗi khi lấy số dư tài khoản:', error);
      return 0;
    }
  }

  async getListVipPackage(): Promise<VipPackage[]> {
    try {
      const response = await api.get<VipPackage[]>('/vip/packages', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gói VIP:', error);
      return [];
    }
  }
}

export const vipService = new VipService();
export default vipService;
