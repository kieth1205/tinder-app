import { VipPackage } from '@/constants/vipPackage';
import api from './api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  likesCount: number;
  superLikesCount: number;
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

export interface CreatePaypalOrderResponse {
  approvalUrl: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface VipStatusResponse {
  isVip: boolean;
  expireDate?: string;
}

export interface SubscriptionHistory {
  id: string;
  packageName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  paymentMethod: string;
  price: number;
  purchasedAt: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

export interface MatchedUser {
  id: string;
  name: string;
  images: string[];
  gender: string;
  birthday: string;
  interests: string[];
}

export interface MatchHistory {
  id: string;
  matchDate: string;
  stabilityScore: number;
  matchedUser: MatchedUser;
  lastMessage: Message | null;
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
      const response = await api.get<LikedByUser[]>('/vip/likes', {
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

  /**
   * Lấy lịch sử đăng ký gói VIP
   */
  async getSubscriptionHistory(): Promise<SubscriptionHistory[]> {
    try {
      const response = await api.get<SubscriptionHistory[]>('/users/subscription-history', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Format các ngày tháng nếu cần
      const subscriptions = response.data || [];
      return subscriptions.map(sub => ({
        ...sub,
        startDate: new Date(sub.startDate).toLocaleDateString('vi-VN'),
        endDate: new Date(sub.endDate).toLocaleDateString('vi-VN'),
        purchasedAt: formatDistanceToNow(new Date(sub.purchasedAt), { addSuffix: true, locale: vi })
      }));
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đăng ký VIP:', error);
      return [];
    }
  }

  /**
   * Lấy lịch sử các match thành công
   */
  async getMatchHistory(): Promise<MatchHistory[]> {
    try {
      const response = await api.get<MatchHistory[]>('/users/match-history', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Format date và các thông tin khác nếu cần
      const matchHistory = response.data || [];
      return matchHistory.map(match => ({
        ...match,
        matchDate: formatDistanceToNow(new Date(match.matchDate), { addSuffix: true, locale: vi })
      }));
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử match:', error);
      return [];
    }
  }

  /**
   * Tạo PayPal order (lấy approval url)
   */
  async createPaypalOrder(amount: number): Promise<string | null> {
    try {
      const response = await api.post<CreatePaypalOrderResponse>(
        '/payment/paypal/create-order',
        { amount },
        { requireAuth: true }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      console.log('response.data', response.data);

      return response.data?.approvalUrl || null;
    } catch (error) {
      console.error('Lỗi khi tạo PayPal order:', error);
      return null;
    }
  }

  /**
   * Capture PayPal order sau khi người dùng thanh toán thành công
   */
  async capturePaypalOrder(token: string): Promise<PaymentResponse> {
    try {
      const response = await api.post<PaymentResponse>(
        '/payment/paypal/capture',
        { token },
        { requireAuth: true }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      return {
        success: true,
        error: undefined,
        amount: response?.data?.amount || 0,
      };
    } catch (error) {
      console.error('Lỗi khi capture PayPal order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        amount: 0,
      };
    }
  }
}

export const vipService = new VipService();
export default vipService;
