import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@/constants/category';
import { useRouter } from 'expo-router';
import { User } from '@/services/userService';
import { getUsersByInterest } from '@/services/interestService';

const InterestMatchesScreen = () => {
  const router = useRouter();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { interestId } = route.params as { interestId: string };
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState<any>(null);

  useEffect(() => {
    // Tìm kiếm thông tin sở thích từ danh sách để hiển thị tiêu đề
    for (const category of CATEGORIES) {
      const found = category.interests.find(item => item.id === interestId);
      if (found) {
        setInterest(found);
        break;
      }
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsersByInterest(interestId);
        setUsers(response);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải người dùng theo sở thích:', err);
        setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [interestId]);

  const handleGoBack = () => {
    router.back();
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user-detail/${userId}`);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserPress(item.id)}
    >
      <Image source={{ uri: item?.images[0] }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userBio}>{item.bio}</Text>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-outline" size={16} color="#888" />
          <Text style={styles.userDistance}>{item.distance} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.titleText}>
            {interest ? interest.label : 'Người dùng theo sở thích'}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6864" />
          <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6864" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              getUsersByInterest(interestId)
                .then(data => {
                  setUsers(data);
                  setError(null);
                })
                .catch(err => {
                  console.error('Lỗi khi thử lại:', err);
                  setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
                })
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#888" />
          <Text style={styles.emptyText}>Không tìm thấy người dùng nào với sở thích này.</Text>
          <Text style={styles.emptySubtext}>Hãy thử tìm kiếm với sở thích khác.</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.userList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  userList: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDistance: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#bbb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6864',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
  },
});

export default InterestMatchesScreen;
