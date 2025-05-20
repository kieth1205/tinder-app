import { MediaItem } from '@/app/(auth)/register/PhotosStep';
import api, { API_BASE_URL } from './api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import * as FileSystem from 'expo-file-system'
import { Platform } from 'react-native';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  matchId?: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface UserInfo {
  id: string;
  name: string | null;
  images: string[];
}

export interface ConversationInfo {
  otherUser: UserInfo;
  latestMessage: Message & {
    sender: UserInfo;
    receiver: UserInfo;
  };
  unreadCount: number;
}

export interface CreateMessageDto {
  senderId: string;
  receiverId: string;
  matchId?: string;
  content: string;
}

export interface CreateImageMessageDto extends CreateMessageDto {
  type: 'image';
}

export interface StartConversationDto {
  receiverId: string;
  matchId?: string;
  content: string;
}

class MessageService {
  async getConversations(): Promise<ConversationInfo[]> {
    try {
      const response = await api.get<ConversationInfo[]>('/messages/mine-conversations', {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    try {
      const response = await api.get<Message[]>(`/messages/conversation?userId=${userId}&otherUserId=${otherUserId}`, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  }

  async sendMessage(message: CreateMessageDto): Promise<Message | null> {
    try {
      const response = await api.post<Message>('/messages', message, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async startConversation(receiverId: string, content: string, matchId?: string): Promise<Message | null> {
    try {
      const dto: StartConversationDto = {
        receiverId,
        content,
        matchId
      };

      const response = await api.post<Message>('/messages/start-conversation', dto, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  }

  async sendImageMessage(senderId: string, receiverId: string, mediaItem: MediaItem, matchId?: string): Promise<Message | null> {
    try {
      console.log("Start send image message", { senderId, receiverId, matchId });

      // Validate inputs
      if (!senderId || !receiverId || !mediaItem) {
        console.error('Missing required parameters for sending image message');
        return null;
      }

      let uri = mediaItem.uri;
      if (Platform.OS === 'android' && !uri.startsWith('file://')) {
        uri = mediaItem.uri;
      } else if (Platform.OS === 'ios') {
        uri = mediaItem.uri.replace('file://', '');
      }

      // Extract filename from URI or generate a unique one
      const fileName = uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const fileType = uri.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      console.log("Preparing to upload file", { uri, fileName, fileType });
      console.log(API_BASE_URL + '/upload/single')


      // Upload image to server
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

      // Parse response and extract image URL
      if (!uploadResult.body) {
        throw new Error('Upload response is empty');
      }

      const body = JSON.parse(uploadResult.body);
      const imageUrl = body?.url;
      console.log("Image uploaded successfully", { imageUrl });

      if (!imageUrl) {
        throw new Error('Không nhận được url ảnh sau khi upload');
      }

      // Create message DTO with the image URL as content
      const dto: CreateImageMessageDto = {
        senderId,
        receiverId,
        matchId,
        content: imageUrl,
        type: 'image',
      };

      console.log("Sending image message to API", dto);

      // Send the message to the API
      const response = await api.post<Message>('/messages', dto, { requireAuth: true });

      if (response.error) {
        throw new Error(response.error);
      }

      console.log("Image message sent successfully", { messageId: response.data?.id });
      return response.data;
    } catch (error: any) {
      console.error('Error sending image message:', JSON.stringify(error));
      // You might want to add analytics tracking for errors here
      return null;
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    try {
      await api.patch(`/messages/${messageId}/read`, {}, {
        requireAuth: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async markAllAsRead(currentUserId: string, otherUserId: string): Promise<void> {
    try {
      await api.patch(`/messages/mark-all-as-read?currentUserId=${currentUserId}&otherUserId=${otherUserId}`, {}, {
        requireAuth: true
      });
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await api.get<{ count: number }>(`/messages/unread-count?userId=${userId}`, {
        requireAuth: true
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  formatMessageTime(date: Date | string): string {
    if (!date) return '';

    const messageDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}p trước`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h trước`;
    } else if (diffInMinutes < 7 * 24 * 60) {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d trước`;
    } else {
      return format(messageDate, 'dd/MM/yyyy', { locale: vi });
    }
  }

  convertToGiftedChatMessages(messages: Message[], currentUserId: string) {
    return messages.map(message => {
      // Simple heuristic: nếu content trông giống url ảnh thì hiển thị dạng ảnh trong GiftedChat
      const isImage = /\.(jpeg|jpg|png|gif)$/i.test(message.content);
      return {
        _id: message.id,
        text: isImage ? '' : message.content,
        image: isImage ? message.content : undefined,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.senderId,
          name: message.senderId === currentUserId ? 'You' : 'Other User'
        },
        sent: true,
        received: message.read,
      };
    });
  }
}

export const messageService = new MessageService();
export default messageService;
