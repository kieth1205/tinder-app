import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Load initial messages
    setMessages([
      {
        _id: 1,
        text: 'Hello there!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Match',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderAvatar={null}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        renderUsernameOnMessage={true}
        alwaysShowSend={true}
        inverted={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
