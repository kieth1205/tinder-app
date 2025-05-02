import { AuthHeader } from '@/components/AuthHeader';
import LikedByUsersList from '@/components/LikedByUsersList';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LikedByScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/(tabs)/profile")} />
      <LikedByUsersList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default LikedByScreen;