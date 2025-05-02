// hooks/useVipStatus.ts - tiếp tục phần bị thiếu
import { useCallback, useEffect, useState } from 'react';
import vipService from '../services/vipService';

interface VipStatus {
  isVip: boolean;
  expireDate?: string;
}

export function useVipStatus() {
  const [isVip, setIsVip] = useState<boolean>(false);
  const [vipExpireDate, setVipExpireDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkVipStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await vipService.checkVipStatus();
      
      if (typeof response === 'object') {
        // Nếu API trả về object với thông tin chi tiết
        setIsVip(response?.isVip || false);
        setVipExpireDate(response?.expireDate || null);
      } else {
        // Nếu API chỉ trả về boolean
        setIsVip(response || false);
        setVipExpireDate(null);
      }
    } catch (err) {
      setError('Không thể kiểm tra trạng thái VIP');
      console.error('Lỗi khi kiểm tra trạng thái VIP:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkVipStatus();
  }, [checkVipStatus]);

  return {
    isVip,
    vipExpireDate,
    loading,
    error,
    refreshVipStatus: checkVipStatus
  };
}

export default useVipStatus;