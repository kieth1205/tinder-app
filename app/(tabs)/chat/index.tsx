import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import messageService, { ConversationInfo } from '@/services/messageService';
import { AuthContext } from '@/context/AuthProvider';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
  unreadCount: number;
}

export default function ChatList() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await messageService.getConversations();
        
        // Convertir el formato de la API al formato que necesita nuestro componente
        const formattedConversations = response.map(conversation => ({
          id: conversation.otherUser.id,
          name: conversation.otherUser.name || 'Usuario',
          lastMessage: conversation.latestMessage.content,
          avatar: conversation.otherUser.images?.length > 0 
            ? conversation.otherUser.images[0] 
            : 'https://randomuser.me/api/portraits/lego/1.jpg',
          timestamp: messageService.formatMessageTime(conversation.latestMessage.timestamp),
          unreadCount: conversation.unreadCount
        }));
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: '/(tabs)/chat/[id]',
        params: {
          id: item.id,
          userId: user?.id,
          name: item.name,
          avatar: item.avatar
        }
      } as any)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
      <Text style={styles.emptySubText}>Hãy bắt đầu kết nối và trò chuyện với các người dùng khác</Text>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await messageService.getConversations();
      const formattedConversations = response.map(conversation => ({
        id: conversation.otherUser.id,
        name: conversation.otherUser.name || 'Usuario',
        lastMessage: conversation.latestMessage.content,
        avatar: conversation.otherUser.images?.length > 0 
          ? conversation.otherUser.images[0] 
          : 'https://randomuser.me/api/portraits/lego/1.jpg',
        timestamp: messageService.formatMessageTime(conversation.latestMessage.timestamp),
        unreadCount: conversation.unreadCount
      }));
      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Tin nhắn</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4C6D" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={renderEmptyComponent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#FF4C6D',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
