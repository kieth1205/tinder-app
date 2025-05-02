import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import useVipStatus from '@/hooks/useVipStatus';
import vipService, { LikedByUser } from '@/services/vipService';
import { useRouter } from 'expo-router';

const LikedByUsersList = () => {
  const [likedByUsers, setLikedByUsers] = useState<LikedByUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isVip } = useVipStatus();
  const router = useRouter();

  useEffect(() => {
    const fetchLikedByUsers = async () => {
      if (!isVip) return;
      
      try {
        setLoading(true);
        const users = await vipService.getLikedByUsers();
        setLikedByUsers(users);
      } catch (err) {
        setError('Không thể tải danh sách người đã thích bạn');
        console.error('Lỗi khi tải danh sách người đã thích:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedByUsers();
  }, [isVip]);

  const handleUserPress = (userId: string) => {
    router.push(`/user-detail/${userId}`);
  };

  if (!isVip) {
    return (
      <View style={styles.upgradeContainer}>
        <Text style={styles.upgradeText}>Nâng cấp tài khoản VIP để xem ai đã thích bạn</Text>
        <Pressable style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Nâng cấp VIP</Text>
        </Pressable>
      </View>
    );
  }

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

  if (likedByUsers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có ai thích bạn</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={likedByUsers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable 
          style={styles.userItem}
          onPress={() => handleUserPress(item.id)}
        >
          <Image 
            source={{ uri: item.images[0] }} 
            style={styles.userImage} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userMeta}>
              {item.age ? `${item.age} tuổi` : ''} 
              {item.age && item.distance ? ' • ' : ''}
              {item.distance ? `${item.distance} km` : ''}
            </Text>
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userMeta: {
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
  upgradeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  upgradeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#FF4D67',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default LikedByUsersList;