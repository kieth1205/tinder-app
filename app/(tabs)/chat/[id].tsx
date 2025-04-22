import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { GiftedChat, IMessage, Send, Actions, Bubble } from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthHeader } from '@/components/AuthHeader';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import messageService from '@/services/messageService';
import { AuthContext } from '@/context/AuthProvider';

export default function ChatDetail() {
  const router = useRouter();
  const { id, userId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const otherUserId = id as string;
  const currentUserId = user?.id || (userId as string);

  const fetchMessages = async () => {
    if (!currentUserId || !otherUserId) return;
    
    try {
      setLoading(true);
      // Lấy tin nhắn và đánh dấu là đã đọc
      const chatMessages = await messageService.getConversation(currentUserId, otherUserId);
      
      // Đánh dấu tất cả tin nhắn từ người kia gửi đến là đã đọc
      messageService.markAllAsRead(currentUserId, otherUserId);
      
      // Chuyển đổi sang định dạng GiftedChat
      const formattedMessages = messageService.convertToGiftedChatMessages(chatMessages, currentUserId);
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Tải tin nhắn từ API
  useEffect(() => {
    fetchMessages();
  }, [currentUserId, otherUserId]);

  // Gửi tin nhắn
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!currentUserId || !otherUserId || newMessages.length === 0) return;
    
    try {
      // Hiển thị tin nhắn trên UI ngay lập tức
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
      
      // Gửi tin nhắn lên server
      const messageContent = newMessages[0].text;
      await messageService.sendMessage({
        senderId: currentUserId,
        receiverId: otherUserId,
        content: messageContent
      });
    } catch (err) {
      console.error('Error sending message:', err);
      // Có thể hiển thị thông báo lỗi nếu cần
    }
  }, [currentUserId, otherUserId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: '',
        createdAt: new Date(),
        image: result.assets[0].uri,
        user: {
          _id: 1,
          name: 'User',
        },
      };
      onSend([newMessage]);
    }
  };

  const renderActions = (props: any) => (
    <Actions
      {...props}
      options={{
        'Chọn ảnh từ thư viện': pickImage,
      }}
      icon={() => (
        <FontAwesome name="image" size={24} color="#2196F3" />
      )}
    />
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      label="Gửi"
    />
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#FF4C6D',
        },
        left: {
          backgroundColor: '#f0f0f0',
        },
      }}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader onBack={() => router.push("/chat")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4C6D" />
          <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader onBack={() => router.push("/chat")} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/chat")} />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUserId,
        }}
        placeholder="Nhập tin nhắn..."
        renderActions={renderActions}
        renderSend={renderSend}
        renderBubble={renderBubble}
        locale="vi"
        timeFormat="HH:mm"
        dateFormat="DD/MM/YYYY"
        renderUsernameOnMessage
        alwaysShowSend
        isTyping={false}
        renderChatFooter={() => null}
        listViewProps={{
          refreshControl: (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4C6D',
    textAlign: 'center',
  },
});
