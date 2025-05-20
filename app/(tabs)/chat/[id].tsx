import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, RefreshControl, Platform } from 'react-native';
import { GiftedChat, IMessage, Send, Actions, Bubble, BubbleProps } from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthHeader } from '@/components/AuthHeader';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import messageService from '@/services/messageService';
import { AuthContext } from '@/context/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/app/(auth)/register/PhotosStep';
import * as FileSystem from 'expo-file-system'
import { API_BASE_URL } from '@/services/api';

export default function ChatDetail() {
  const router = useRouter();
  const { id, userId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const otherUserId = id as string;
  const currentUserId = user?.id || (userId as string);

  // Sử dụng react-query để load tin nhắn với refresh interval 1 giây
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['messages', currentUserId, otherUserId],
    queryFn: async () => {
      if (!currentUserId || !otherUserId) return [];

      // Lấy tin nhắn và đánh dấu là đã đọc
      const chatMessages = await messageService.getConversation(currentUserId, otherUserId);

      // Đánh dấu tất cả tin nhắn từ người kia gửi đến là đã đọc
      await messageService.markAllAsRead(currentUserId, otherUserId);

      // Chuyển đổi sang định dạng GiftedChat
      return messageService.convertToGiftedChatMessages(chatMessages, currentUserId);
    },
    // refetchInterval: 1000, // Refresh interval: 1 giây
    enabled: !!currentUserId && !!otherUserId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Cleanup function to stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        Speech.stop();
      }
    };
  }, [isSpeaking]);

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

      // Refresh lại danh sách tin nhắn sau khi gửi
      refetch();
    } catch (err: any) {
      console.error('Error sending message:', err.message);
      // Có thể hiển thị thông báo lỗi nếu cần
    }
  }, [currentUserId, otherUserId, refetch]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMedia: MediaItem = {
          uri: asset.uri,
          type: 'image',
          name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        };

        // Hiển thị ngay ảnh vừa chọn
        const optimisticMessage: IMessage = {
          _id: Math.random().toString(),
          text: '',
          createdAt: new Date(),
          image: newMedia.uri,
          user: {
            _id: currentUserId,
            name: 'You',
          },
        };
        setMessages(prev => GiftedChat.append(prev, [optimisticMessage]));

        // Xử lý URI cho Android (content:// URI) và iOS
        let uri = newMedia.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          // Giữ nguyên content:// URI cho Android
          uri = newMedia.uri;
        } else if (Platform.OS === 'ios') {
          // Xử lý cho iOS nếu cần
          uri = newMedia.uri.replace('file://', '');
        }

        const uploadResult = await FileSystem.uploadAsync(
          API_BASE_URL + '/upload/single',
          uri,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'file',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        const body = JSON.parse(uploadResult.body)
        const imageUrl = body?.url as string;
        await messageService.sendImageMessage(currentUserId, otherUserId, imageUrl);
        // refetch();
      }
    } catch (err) {
      console.error('Error picking or sending image:', err);
    }
  };

  const renderActions = (props: any) => (
    <Actions
      {...props}
      options={{
        'Chọn ảnh từ thư viện': pickImage,
      }}
      icon={() => (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <FontAwesome name="image" size={24} color="#2196F3" />
        </View>
      )}
    />
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      label="Gửi"
    />
  );

  // Custom Bubble component with text-to-speech functionality
  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
      </View>
    );
  };

  if (isLoading) {
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
          <Text style={styles.errorText}>Không thể tải tin nhắn. Vui lòng thử lại sau.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
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
  speakButton: {
    marginHorizontal: 5,
    padding: 5,
  },
});