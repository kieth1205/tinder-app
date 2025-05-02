import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import vipService from '../../../services/vipService';

interface DirectMessageModalProps {
  visible: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
}

const DirectMessageModal: React.FC<DirectMessageModalProps> = ({ 
  visible, 
  onClose, 
  receiverId,
  receiverName
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    try {
      setSending(true);
      setError(null);
      
      const response = await vipService.sendDirectMessage(receiverId, message.trim());
      
      if (response.success) {
        setSuccess(true);
        setMessage('');
        // Tự động đóng modal sau 2 giây
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(response.error || 'Không thể gửi tin nhắn');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi gửi tin nhắn');
      console.error('Lỗi khi gửi tin nhắn trực tiếp:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Gửi tin nhắn đến {receiverName}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>
          
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>Tin nhắn đã được gửi thành công!</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Nhập tin nhắn của bạn..."
                multiline
                maxLength={500}
                autoFocus
              />
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <View style={styles.footer}>
                <Text style={styles.counter}>{message.length}/500</Text>
                <Pressable 
                  style={[
                    styles.sendButton, 
                    (!message.trim() || sending) && styles.sendButtonDisabled
                  ]}
                  onPress={handleSend}
                  disabled={!message.trim() || sending}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.sendButtonText}>Gửi</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  counter: {
    color: '#666',
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#FF4D67',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  successContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DirectMessageModal;