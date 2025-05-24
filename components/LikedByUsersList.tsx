import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import useVipStatus from '@/hooks/useVipStatus';
import vipService from '@/services/vipService';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface LikerInfo {
  liked_at: string;
  user: {
    id: string;
    name: string;
    images: string[];
    gender: string;
    birthday: string | null;
    interests: string[];
    job: string | null;
  };
  direction: "LEFT" | "RIGHT" | "UP";
}

const LikedByUsersList = () => {
  const [likedByUsers, setLikedByUsers] = useState<LikerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isVip } = useVipStatus();
  const router = useRouter();

  const fetchLikedByUsers = async () => {
    if (!isVip) return;
    
    try {
      setLoading(true);
      const users = await vipService.getLikedByUsers();
      setLikedByUsers(users as unknown as LikerInfo[]);
    } catch (err) {
      setError('Không thể tải danh sách người đã thích bạn');
      console.error('Lỗi khi tải danh sách người đã thích:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedByUsers();
  }, [isVip]);

  const handleUserPress = (userId: string) => {

    console.log(userId);

    router.push(`/user-detail/${userId}`);
  };

  const formatLikedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
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

  return (
    <FlatList
      data={likedByUsers}
      keyExtractor={(item, index) => item.user.id || index.toString()}
      renderItem={({ item }) => (
        <Pressable 
          style={styles.userItem}
          onPress={() => handleUserPress(item.user.id)}
        >
          <Image 
            source={{ uri: item.user.images[0] }} 
            style={styles.userImage} 
          />
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{item.user.name}</Text>
              {item.direction === 'UP' && (
                <View style={styles.superLikeContainer}>
                  <Ionicons name="flame" size={18} color="#1DA1F2" style={styles.superLikeIcon} />
                  <Text style={styles.superLikeText}>Super Like</Text>
                </View>
              )}
            </View>
            <Text style={styles.userMeta}>
              {item.user.gender === 'MALE' ? 'Nam' : 'Nữ'}
              {item.user.interests && item.user.interests.length > 0 ? ' • ' : ''}
              {item.user.interests && item.user.interests.length > 0 ? 
                `${item.user.interests.length} sở thích` : ''}
            </Text>
            <Text style={styles.likedDate}>Đã thích bạn: {formatLikedDate(item.liked_at)}</Text>
          </View>
        </Pressable>
      )}
      contentContainerStyle={styles.listContent}
      onRefresh={fetchLikedByUsers}
      refreshing={loading}
      ListEmptyComponent={<Text style={styles.emptyText}>Chưa có ai thích bạn</Text>}
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  superLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(29, 161, 242, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  superLikeIcon: {
    marginRight: 2,
  },
  superLikeText: {
    fontSize: 12,
    color: '#1DA1F2',
    fontWeight: '500',
  },
  userMeta: {
    fontSize: 14,
    color: '#666',
  },
  likedDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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