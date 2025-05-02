import { AuthHeader } from '@/components/AuthHeader';
import MatchHistoryList from '@/components/MatchHistoryList';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MatchHistoryScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/(tabs)/profile")} title="Lịch sử match" />
      <MatchHistoryList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default MatchHistoryScreen;
