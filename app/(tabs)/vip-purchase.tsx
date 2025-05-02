import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { VipPackage, formatCurrency } from '../../constants/vipPackage';
import vipService from '../../services/vipService';
import BalanceDisplay from '../../components/BalanceDisplay';
import { useVipStatus } from '../../hooks/useVipStatus';

const VipPurchaseScreen = () => {
  const [balance, setBalance] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isVip, refreshVipStatus } = useVipStatus();
  const router = useRouter();
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);

  useEffect(() => {
    fetchBalance();
    fetchVipPackages();
  }, []);

  const fetchBalance = async () => {
    const userBalance = await vipService.getBalance();
    setBalance(userBalance);
  };

  const fetchVipPackages = async () => {
    const packages = await vipService.getListVipPackage();
    setVipPackages(packages);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Thông báo', 'Vui lòng chọn một gói VIP');
      return;
    }

    const selectedPkg = vipPackages.find(pkg => pkg.id === selectedPackage);
    if (!selectedPkg) return;

    if (balance < selectedPkg.price) {
      Alert.alert(
        'Số dư không đủ',
        'Bạn không có đủ số dư để mua gói VIP này. Bạn có muốn nạp thêm tiền không?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Nạp tiền', onPress: handleAddMoney }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const response = await vipService.purchaseVip(selectedPackage);
      
      if (response.success) {
        Alert.alert(
          'Thành công',
          'Bạn đã mua gói VIP thành công!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
        await fetchBalance();
        await refreshVipStatus();
      } else {
        Alert.alert('Lỗi', response.error || 'Không thể mua gói VIP. Vui lòng thử lại sau.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý thanh toán');
      console.error('Lỗi khi mua VIP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = () => {
    // Điều hướng đến màn hình nạp tiền hoặc hiển thị modal
    Alert.alert(
      'Nạp tiền',
      'Chọn số tiền bạn muốn nạp:',
      [
        { text: '100.000đ', onPress: () => depositMoney(100000) },
        { text: '200.000đ', onPress: () => depositMoney(200000) },
        { text: '500.000đ', onPress: () => depositMoney(500000) },
        { text: 'Hủy', style: 'cancel' }
      ]
    );
  };

  const depositMoney = async (amount: number) => {
    try {
      setLoading(true);
      const response = await vipService.depositMoney(amount);
      
      if (response.success) {
        Alert.alert('Thành công', 'Bạn đã nạp tiền thành công!');
        await fetchBalance();
      } else {
        Alert.alert('Lỗi', response.error || 'Không thể nạp tiền. Vui lòng thử lại sau.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý nạp tiền');
      console.error('Lỗi khi nạp tiền:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nâng cấp VIP</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* Balance Display */}
        <BalanceDisplay balance={balance} onAddMoney={handleAddMoney} />

        {/* VIP Packages */}
        <Text style={styles.sectionTitle}>Chọn gói VIP</Text>
        <View style={styles.packagesContainer}>
          {vipPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                selectedPackage === pkg.id && styles.selectedPackage,
                pkg.mostPopular && styles.popularPackage
              ]}
              onPress={() =>  setSelectedPackage(pkg.id)}
            >
              {pkg.mostPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Phổ biến nhất</Text>
                </View>
              )}
              
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packagePrice}>{formatCurrency(pkg.price)}</Text>
              
              <View style={styles.featuresContainer}>
                {pkg.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#FF4D67" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              {selectedPackage === pkg.id && (
                <Ionicons 
                  name="checkmark-circle" 
                  size={24} 
                  color="#FF4D67" 
                  style={styles.selectedIcon} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* VIP Benefits */}
        <Text style={styles.sectionTitle}>Quyền lợi VIP</Text>
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="message-text" size={24} color="#FF4D67" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Gửi tin nhắn trực tiếp</Text>
              <Text style={styles.benefitDescription}>
                Gửi tin nhắn cho bất kỳ ai mà không cần phải match trước
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="heart" size={24} color="#FF4D67" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Xem ai đã thích bạn</Text>
              <Text style={styles.benefitDescription}>
                Biết được ai đã dành tình cảm cho bạn để dễ dàng match
              </Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Ionicons name="star" size={24} color="#FF4D67" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Xem người nổi bật</Text>
              <Text style={styles.benefitDescription}>
                Xem danh sách những người được quan tâm nhiều nhất
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.purchaseButton, (!selectedPackage || loading) && styles.disabledButton]}
          onPress={handlePurchase}
          disabled={!selectedPackage || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.purchaseButtonText}>Mua ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  packagesContainer: {
    paddingHorizontal: 16,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedPackage: {
    borderWidth: 2,
    borderColor: '#FF4D67',
  },
  popularPackage: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 22,
    color: '#FF4D67',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#555',
    flex: 1,
  },
  selectedIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  benefitsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  benefitContent: {
    marginLeft: 16,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  purchaseButton: {
    backgroundColor: '#FF4D67',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  purchaseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VipPurchaseScreen;