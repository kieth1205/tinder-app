export interface VipPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  mostPopular?: boolean;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};