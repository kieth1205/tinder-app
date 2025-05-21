import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, RefreshControl, Platform, Alert, Linking, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { GiftedChat, IMessage, Send, Actions, Bubble, BubbleProps } from 'react-native-gifted-chat';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthHeader } from '@/components/AuthHeader';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import messageService from '@/services/messageService';
import { AuthContext } from '@/context/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '@/app/(auth)/register/PhotosStep';
import * as FileSystem from 'expo-file-system'
import { API_BASE_URL } from '@/services/api';
import { Audio } from 'expo-av';
import axios from 'axios';

const API_KEY = '4b5ac35c91ac4377805b3f25505be51b';
const ASSEMBLYAI_TRANSCRIPT_URL = 'https://api.assemblyai.com/v2/transcript';

export default function ChatDetail() {
  const router = useRouter();
  const { id, userId } = useLocalSearchParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopping' | 'stopped'>('idle');
  const [audioPermission, setAudioPermission] = useState(false);
  const [speechPermission, setSpeechPermission] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('111');

  const otherUserId = id as string;
  const currentUserId = user?.id || (userId as string);

  // Sử dụng react-query để load tin nhắn với refresh interval 1 giây
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['messages', currentUserId, otherUserId],
    queryFn: async () => {
      if (!currentUserId || !otherUserId) return [];

      // Lấy tin nhắn và đánh dấu là đã đọc
      const chatMessages = await messageService.getConversation(currentUserId, otherUserId);

      // Đánh dấu tất cả tin nhắn từ người kia gửi đến là đã đọc
      await messageService.markAllAsRead(currentUserId, otherUserId);

      // Chuyển đổi sang định dạng GiftedChat
      return messageService.convertToGiftedChatMessages(chatMessages, currentUserId);
    },
    // refetchInterval: 1000, // Refresh interval: 1 giây
    enabled: !!currentUserId && !!otherUserId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Gửi tin nhắn
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    if (!currentUserId || !otherUserId || newMessages.length === 0) return;

    try {
      // Hiển thị tin nhắn trên UI ngay lập tức
      setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

      // Gửi tin nhắn lên server
      const messageContent = newMessages[0].text;
      await messageService.sendMessage({
        senderId: currentUserId,
        receiverId: otherUserId,
        content: messageContent
      });

      // Refresh lại danh sách tin nhắn sau khi gửi
      refetch();
    } catch (err: any) {
      console.error('Error sending message:', err.message);
      // Có thể hiển thị thông báo lỗi nếu cần
    }
  }, [currentUserId, otherUserId, refetch]);

  useEffect(() => {
    // Xin quyền truy cập microphone khi app khởi chạy
    const getPermissions = async () => {
      try {
        console.log('Kiểm tra quyền truy cập microphone...');

        // Kiểm tra trạng thái quyền hiện tại
        const permissionResponse = await Audio.getPermissionsAsync();
        console.log('Trạng thái quyền hiện tại:', permissionResponse.status);

        if (permissionResponse.status === 'granted') {
          // Đã có quyền từ trước
          console.log('Đã có quyền truy cập microphone');
          setAudioPermission(true);
          setSpeechPermission(true);  // Mặc định coi speech permission đã được cấp
        } else {
          // Yêu cầu quyền nếu chưa có
          console.log('Yêu cầu quyền truy cập microphone...');
          const { status } = await Audio.requestPermissionsAsync();
          console.log('Kết quả yêu cầu quyền:', status);

          if (status === 'granted') {
            console.log('Đã được cấp quyền microphone');
            setAudioPermission(true);
            setSpeechPermission(true);
          } else {
            console.log('Quyền truy cập microphone bị từ chối');
            // Đây là hướng dẫn quan trọng để người dùng biết cách cấp quyền
            Alert.alert(
              'Cần quyền truy cập',
              'Ứng dụng cần quyền truy cập microphone để thu âm. Bạn có muốn mở cài đặt để cấp quyền không?',
              [
                {
                  text: 'Mở Cài đặt',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.openSettings();
                    }
                  }
                },
                { text: 'Để sau' }
              ]
            );
          }
        }

        // Cài đặt âm thanh cho thu âm (nếu có quyền)
        if (permissionResponse.status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        }
      } catch (error) {
        console.log('Lỗi khi xin quyền truy cập:', error);
        Alert.alert('Lỗi', 'Không thể xin quyền truy cập microphone');
      }
    };

    getPermissions();

    // Cleanup khi component unmount
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(error =>
          console.log('Lỗi khi dừng recording:', error)
        );
      }
    };
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newMedia: MediaItem = {
          uri: asset.uri,
          type: 'image',
          name: asset.uri.split('/').pop() || `image-${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        };

        // Hiển thị ngay ảnh vừa chọn
        const optimisticMessage: IMessage = {
          _id: Math.random().toString(),
          text: '',
          createdAt: new Date(),
          image: newMedia.uri,
          user: {
            _id: currentUserId,
            name: 'You',
          },
        };
        setMessages(prev => GiftedChat.append(prev, [optimisticMessage]));

        // Xử lý URI cho Android (content:// URI) và iOS
        let uri = newMedia.uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          // Giữ nguyên content:// URI cho Android
          uri = newMedia.uri;
        } else if (Platform.OS === 'ios') {
          // Xử lý cho iOS nếu cần
          uri = newMedia.uri.replace('file://', '');
        }

        const uploadResult = await FileSystem.uploadAsync(
          API_BASE_URL + '/upload/single',
          uri,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            fieldName: 'file',
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        const body = JSON.parse(uploadResult.body)
        const imageUrl = body?.url as string;
        await messageService.sendImageMessage(currentUserId, otherUserId, imageUrl);
        refetch();
      }
    } catch (err) {
      console.error('Error picking or sending image:', err);
    }
  };

  const startRecording = async () => {
    try {
      // Kiểm tra quyền truy cập microphone
      if (!audioPermission) {
        // Nếu chưa có quyền, yêu cầu lại
        const permissionCheck = await Audio.getPermissionsAsync();

        if (permissionCheck.status !== 'granted') {
          const { status } = await Audio.requestPermissionsAsync();
          setAudioPermission(status === 'granted');

          if (status !== 'granted') {
            Alert.alert(
              'Cần quyền truy cập',
              'Vui lòng cấp quyền sử dụng microphone để thu âm',
              [
                { text: 'Hủy' },
                {
                  text: 'Mở Cài đặt',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');
                    } else {
                      Linking.openSettings();
                    }
                  }
                }
              ]
            );
            return;
          }
        } else {
          setAudioPermission(true);
        }
      }
      // Cài đặt âm thanh cho thu âm
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Xóa bản ghi âm cũ nếu có
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      // Cài đặt cấu hình thu âm
      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/mpeg',
          bitsPerSecond: 128000,
        },
      };

      // Bắt đầu thu âm
      console.log('Bắt đầu thu âm...');
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();

      setRecording(newRecording);
      setRecordingStatus('recording');
      console.log('Đang thu âm...');
    } catch (error) {
      console.log('Lỗi bắt đầu thu âm:', error);
      Alert.alert('Lỗi', 'Không thể bắt đầu thu âm');
    }
  };

  const uploadToServer = async (fileUri: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      console.log('Bắt đầu upload file lên server...', fileUri);

      // Tạo tên file dựa trên timestamp
      const fileName = `audio_${Date.now()}.wav`;

      // Sử dụng FileSystem.uploadAsync để upload file lên API endpoint
      const uploadResult = await FileSystem.uploadAsync(
        `${API_BASE_URL}/upload/audio`, // Endpoint của API upload
        fileUri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'audio', // Phải khớp với tên field trong @UseInterceptors(FileInterceptor('audio'))
          mimeType: 'audio/wav', // Định dạng MIME của file audio
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          parameters: {
            fileName: fileName
          }
        }
      );

      if (uploadResult.status >= 200 && uploadResult.status < 300) {
        try {
          const responseData = JSON.parse(uploadResult.body);

          if (responseData && responseData.url) {
            console.log('Upload thành công, URL:', responseData.url);
            setUploadProgress(100);
            setIsUploading(false);
            return responseData.url;
          } else {
            throw new Error('Response không chứa URL');
          }
        } catch (parseError) {
          console.error('Lỗi phân tích response:', parseError);
          console.log('Response body:', uploadResult.body);
          throw new Error('Không thể phân tích response từ server');
        }
      } else {
        throw new Error(`Upload thất bại với status code: ${uploadResult.status}`);
      }
    } catch (error) {
      console.error('Lỗi upload file lên server:', error);
      setIsUploading(false);
      Alert.alert('Thông báo', 'Không thể upload file âm thanh lên server');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log('Không có bản ghi âm để dừng');
        return;
      }

      console.log('Dừng thu âm...');
      setRecordingStatus('stopping');

      await recording.stopAndUnloadAsync();
      setRecordingStatus('stopped');

      const uri = recording.getURI();
      if (!uri) {
        throw new Error('Không thể lấy URI của bản ghi âm');
      }
      console.log('File âm thanh đã được lưu tại:', uri);

      try {
        const downloadURL = await uploadToServer(uri);
        await transcribeAudio(downloadURL);
      } catch (error) {
        console.error('Lỗi trong quá trình xử lý sau khi thu âm:', error);
        Alert.alert('Thông báo', 'Có lỗi xảy ra khi xử lý file âm thanh');
      }

      setRecording(null);
    } catch (error) {
      console.log('Lỗi dừng thu âm:', error);
      Alert.alert('Lỗi', 'Không thể dừng thu âm');
    } finally {
      setRecordingStatus('idle');
      setRecording(null);
      setVoiceModalVisible(false);
    }
  };

  const transcribeAudio = async (audioUrl: string) => {
    console.log("Bắt đầu transcribe với URL:", audioUrl);

    if (!audioUrl) {
      console.log('Không có URL âm thanh để chuyển đổi');
      return;
    }

    if (!speechPermission) {
      Alert.alert(
        'Thông báo',
        'Cần quyền truy cập nhận diện giọng nói để chuyển đổi âm thanh thành văn bản',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsTranscribing(true);
    try {
      console.log('Bắt đầu gửi yêu cầu chuyển đổi đến AssemblyAI...');

      const transcriptResponse = await axios.post(
        ASSEMBLYAI_TRANSCRIPT_URL,
        {
          audio_url: audioUrl,
          language_code: 'vi',
          speech_model: "universal",
        },
        {
          headers: {
            authorization: API_KEY,
          },
        }
      );

      const transcriptId = transcriptResponse.data.id as string;
      console.log('Tạo transcript id:', transcriptId);

      // 3. Poll kết quả
      const pollingEndpoint = `${ASSEMBLYAI_TRANSCRIPT_URL}/${transcriptId}`;
      let status = '';
      setTranscribedText('Đang xử lý âm thanh, vui lòng chờ...');

      while (status !== 'completed') {
        await new Promise((res) => setTimeout(res, 3000));
        const pollingRes = await axios.get(pollingEndpoint, {
          headers: { authorization: API_KEY },
        });
        status = pollingRes.data.status;
        console.log('Trạng thái phiên dịch:', status);

        if (status === 'error') {
          throw new Error(`Transcription failed: ${pollingRes.data.error}`);
        }
        if (status === 'completed') {
          const text = pollingRes.data.text ?? '';
          const _transcribedText = text || 'Không phát hiện nội dung giọng nói nào.';
          setTranscribedText(_transcribedText);
          setCurrentMessage(_transcribedText);
        }
      }
    } catch (error) {
      console.error('Lỗi chuyển đổi âm thanh thành văn bản:', error);
      Alert.alert('Lỗi', 'Không thể chuyển đổi âm thanh thành văn bản');
      setTranscribedText('Đã xảy ra lỗi khi chuyển đổi âm thanh thành văn bản.');
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const pickVoice = () => {
    setVoiceModalVisible(true);
  }

  const renderActions = (props: any) => (
    <>
      <Actions
        {...props}
        options={{
          'Chọn ảnh từ thư viện': pickImage,
        }}
        icon={() => (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FontAwesome name="image" size={24} color="#2196F3" />
          </View>
        )}
      />
      <Actions
        {...props}
        options={{
          'Ghi âm': pickVoice,
        }}
        icon={() => (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FontAwesome name="microphone" size={24} color="#2196F3" />
          </View>
        )}
      />
    </>
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      label="Gửi"
    />
  );

  // Custom Bubble component with text-to-speech functionality
  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#FF4C6D',
            },
            left: {
              backgroundColor: '#f0f0f0',
            },
          }}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader onBack={() => router.push("/chat")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4C6D" />
          <Text style={styles.loadingText}>Đang tải tin nhắn...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader onBack={() => router.push("/chat")} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không thể tải tin nhắn. Vui lòng thử lại sau.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader onBack={() => router.push("/chat")} />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUserId,
        }}
        text={currentMessage}
        onInputTextChanged={setCurrentMessage}
        placeholder="Nhập tin nhắn..."
        renderActions={renderActions}
        renderSend={renderSend}
        renderBubble={renderBubble}
        locale="vi"
        timeFormat="HH:mm"
        dateFormat="DD/MM/YYYY"
        renderUsernameOnMessage
        alwaysShowSend
        isTyping={false}
        renderChatFooter={() => null}
        listViewProps={{
          refreshControl: (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ),
        }}
      />

      {/* Voice to Text Modal */}
      <Modal
        visible={voiceModalVisible}
        animationType="slide"
        onRequestClose={() => setVoiceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.recordButtonContainer}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                { backgroundColor: recordingStatus === 'recording' ? '#FF4C6D' : '#2196F3' },
              ]}
              onPress={() => {
                if (recordingStatus === 'recording') {
                  stopRecording();
                } else {
                  startRecording();
                }
              }}
            >
              {recordingStatus === 'recording' ? (
                <FontAwesome name="stop" size={48} color="#fff" />
              ) : (
                <FontAwesome name="microphone" size={48} color="#fff" />
              )}
            </TouchableOpacity>
            <Text style={styles.statusText}>
              {recordingStatus === 'recording'
                ? 'Đang thu âm...'
                : ''}
            </Text>

            {isTranscribing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF4C6D" />
                <Text style={styles.loadingText}>Đang chuyển đổi âm thanh...</Text>
              </View>
            )}

            {isUploading && uploadProgress < 100 && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF4C6D" />
                <Text style={styles.loadingText}>{uploadProgress}%</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={() => setVoiceModalVisible(false)}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4C6D',
    textAlign: 'center',
  },
  speakButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  recordButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  transcriptionBox: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  transcriptionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: '#FF4C6D',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});