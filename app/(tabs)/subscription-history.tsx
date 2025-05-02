import { AuthHeader } from '@/components/AuthHeader';
import SubscriptionHistoryList from '@/components/SubscriptionHistoryList';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SubscriptionHistoryScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader title="Lịch sử mua gói VIP" onBack={() => router.push("/(tabs)/profile")} />
      <SubscriptionHistoryList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SubscriptionHistoryScreen;
