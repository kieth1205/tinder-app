import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import vipService, { MatchHistory } from '@/services/vipService';
import { useRouter } from 'expo-router';

const MatchHistoryList = () => {
  const [matches, setMatches] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMatchHistory();
  }, []);

  const fetchMatchHistory = async () => {
    try {
      setLoading(true);
      const history = await vipService.getMatchHistory();
      setMatches(history);
    } catch (err) {
      setError('Không thể tải lịch sử match');
      console.error('Lỗi khi tải lịch sử match:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user-detail/${userId}`);
  };

  const handleChatPress = (matchId: string) => {
    router.push(`/chat/${matchId}`);
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
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.matchItem}>
          <View style={styles.headerRow}>
            <Pressable 
              onPress={() => handleUserPress(item.matchedUser.id)}
              style={styles.userInfoContainer}
            >
              <Image 
                source={{ uri: item.matchedUser.images[0] }} 
                style={styles.userImage} 
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.matchedUser.name}</Text>
                <Text style={styles.matchDate}>Match {item.matchDate}</Text>
              </View>
            </Pressable>
            <Pressable 
              style={styles.chatButton}
              onPress={() => handleChatPress(item.matchedUser.id)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FF4D67" />
            </Pressable>
          </View>
          
          {item.lastMessage && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageLabel}>Tin nhắn gần nhất:</Text>
              <Text style={styles.messageContent} numberOfLines={1} ellipsizeMode="tail">
                {item.lastMessage.content}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(item.lastMessage.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit', 
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit'
                })}
              </Text>
            </View>
          )}
        </View>
      )}
      onRefresh={fetchMatchHistory}
      refreshing={loading}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có match nào</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  matchItem: {
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
  messageContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  messageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
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

export default MatchHistoryList;
