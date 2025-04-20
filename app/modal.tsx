import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useState, useCallback, useEffect } from 'react';

export default function ModalScreen() {
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
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
