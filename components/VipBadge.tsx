import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VipBadgeProps {
  expiryDate?: string; // ISO date string
  size?: 'small' | 'medium' | 'large';
}

const VipBadge: React.FC<VipBadgeProps> = ({ expiryDate, size = 'medium' }) => {
  // Format expiry date
  const formattedDate = expiryDate 
    ? new Date(expiryDate).toLocaleDateString('vi-VN')
    : undefined;
  
  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return {
          container: styles.containerSmall,
          icon: 14,
          text: styles.textSmall
        };
      case 'large':
        return {
          container: styles.containerLarge,
          icon: 20,
          text: styles.textLarge
        };
      default:
        return {
          container: styles.containerMedium,
          icon: 16, 
          text: styles.textMedium
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  
  return (
    <View style={[styles.container, sizeStyles.container]}>
      <Ionicons name="star" size={sizeStyles.icon} color="#FFF" />
      <Text style={[styles.text, sizeStyles.text]}>VIP</Text>
      {formattedDate && (
        <Text style={[styles.expiryText, sizeStyles.text === styles.textSmall ? styles.expiryTextSmall : null]}>
          (Hết hạn: {formattedDate})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 12,
  },
  containerSmall: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  containerMedium: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  containerLarge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 16,
  },
  expiryText: {
    color: '#000',
    marginLeft: 4,
    opacity: 0.7,
  },
  expiryTextSmall: {
    fontSize: 8,
  }
});

export default VipBadge;