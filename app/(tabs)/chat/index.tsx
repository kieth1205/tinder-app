import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
}

// Mock data for chat list
const chatList: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Hey, how are you?',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    timestamp: '2m ago',
  },
  {
    id: '2',
    name: 'Mike Smith',
    lastMessage: 'Want to meet up?',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    timestamp: '1h ago',
  },
  // Add more mock data as needed
];

export default function ChatList() {
  const router = useRouter();

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => router.push({
        pathname: '/modal',
        params: {
          id: item.id,
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
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
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
  },
});
