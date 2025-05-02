import { AuthHeader } from '@/components/AuthHeader';
import PopularUsersList from '@/components/PopularUsersList';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const PopularUsersScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/(tabs)/profile")} />
      <PopularUsersList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PopularUsersScreen;