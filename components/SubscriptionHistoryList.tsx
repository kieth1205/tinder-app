import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import vipService, { SubscriptionHistory } from '@/services/vipService';

const SubscriptionHistoryList = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionHistory();
  }, []);

  const fetchSubscriptionHistory = async () => {
    try {
      setLoading(true);
      const history = await vipService.getSubscriptionHistory();
      setSubscriptions(history);
    } catch (err) {
      setError('Không thể tải lịch sử đăng ký VIP');
      console.error('Lỗi khi tải lịch sử đăng ký VIP:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4D67" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.subscriptionItem}>
          <View style={styles.headerRow}>
            <View style={styles.packageNameContainer}>
              <Text style={styles.packageName}>{item.packageName}</Text>
              {item.isActive && <View style={styles.activeIndicator}><Text style={styles.activeText}>Đang hoạt động</Text></View>}
            </View>
            <Text style={styles.price}>{new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.detailText}>Thời hạn: {item.startDate} - {item.endDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.detailText}>Phương thức: Tiền mặt</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" style={styles.icon} />
            <Text style={styles.detailText}>Đã mua: {item.purchasedAt}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa đăng ký gói VIP nào</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  subscriptionItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  price: {
    fontWeight: '600',
    color: '#FF4D67',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF4D67',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SubscriptionHistoryList;
