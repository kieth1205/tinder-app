import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage, Send, Actions } from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthHeader } from '@/components/AuthHeader';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/chat/index")} />

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Nhập tin nhắn..."
        renderActions={renderActions}
        renderSend={renderSend}
        locale="vi"
        timeFormat="HH:mm"
        dateFormat="DD/MM/YYYY"
        renderUsernameOnMessage
        alwaysShowSend
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
