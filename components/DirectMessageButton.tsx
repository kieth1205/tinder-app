import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useVipStatus from '@/hooks/useVipStatus';

interface DirectMessageButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const DirectMessageButton: React.FC<DirectMessageButtonProps> = ({ onPress, disabled = false }) => {
  const { isVip } = useVipStatus();

  if (!isVip) return null;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name="mail" size={16} color="white" />
      <Text style={styles.buttonText}>Gửi tin nhắn</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4D67',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 8,
    gap: 6
  },
  buttonPressed: {
    opacity: 0.8,
    backgroundColor: '#E6455D'
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#888'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});

export default DirectMessageButton;