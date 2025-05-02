import PopularUsersList from '@/components/PopularUsersList';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const PopularUsersScreen = () => {
  return (
    <View style={styles.container}>
      <PopularUsersList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default PopularUsersScreen;