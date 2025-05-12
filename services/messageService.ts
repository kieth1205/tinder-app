import api from './api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

  async sendImageMessage(senderId: string, receiverId: string, imageUri: string, matchId?: string): Promise<Message | null> {
    try {
      // Prepare file object
      const fileName = imageUri.split('/').pop() || `image_${Date.now()}.jpg`;
      const file = { uri: imageUri, name: fileName, type: 'image/jpeg' } as any;

      // Upload image to server
      const uploadResponse = await api.upload<{ url: string }>(
        '/upload/single',
        [file],
        { fieldName: 'file', requireAuth: true }
      );

      if (uploadResponse.error) {
        throw new Error(uploadResponse.error);
      }

      const imageUrl = uploadResponse.data?.url;
      if (!imageUrl) {
        throw new Error('Không nhận được url ảnh sau khi upload');
      }

      // Gửi tin nhắn dạng ảnh (content là url tệp ảnh)
      const dto: CreateImageMessageDto = {
        senderId,
        receiverId,
        matchId,
        content: imageUrl,
        type: 'image',
      };

      const response = await api.post<Message>('/messages', dto, { requireAuth: true });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error('Error sending image message:', error);
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
