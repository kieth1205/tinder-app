import LikedByUsersList from '@/components/LikedByUsersList';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const LikedByScreen = () => {
  return (
    <View style={styles.container}>
      <LikedByUsersList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default LikedByScreen;