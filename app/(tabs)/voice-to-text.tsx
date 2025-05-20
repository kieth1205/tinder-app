import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

// API Key cho AssemblyAI
const API_KEY = '4b5ac35c91ac4377805b3f25505be51b';
// API Endpoints
const ASSEMBLYAI_TRANSCRIPT_URL = 'https://api.assemblyai.com/v2/transcript';

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopping' | 'stopped'>('idle');
  const [audioPermission, setAudioPermission] = useState(false);
  const [speechPermission, setSpeechPermission] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [audioUri, setAudioUri] = useState('');
  const [transcriptionId, setTranscriptionId] = useState<string | null>(null);

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
      if (soundObject) {
        soundObject.unloadAsync().catch(error =>
          console.log('Lỗi khi unload sound:', error)
        );
      }
    };
  }, []);

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
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
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

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.log('Không có bản ghi âm để dừng');
        return;
      }

      console.log('Dừng thu âm...');
      setRecordingStatus('stopping');

      // Dừng bản ghi âm
      await recording.stopAndUnloadAsync();
      setRecordingStatus('stopped');

      // Lấy URI của file âm thanh
      const uri = recording.getURI();
      if (!uri) {
        throw new Error('Không thể lấy URI của bản ghi âm');
      }
      console.log('File âm thanh đã được lưu tại:', uri);
      setAudioUri(uri);

      // Tạo đối tượng Sound để phát lại âm thanh
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSoundObject(sound);

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

      // Tiến hành chuyển đổi âm thanh thành văn bản
      await transcribeAudio(body?.url);

      setRecording(null);
    } catch (error) {
      console.log('Lỗi dừng thu âm:', error);
      Alert.alert('Lỗi', 'Không thể dừng thu âm');
      setRecordingStatus('idle');
      setRecording(null);
    }
  };

  const transcribeAudio = async (audioUri: string) => {
    console.log("audioUri", audioUri)

    if (!audioUri) {
      console.log('Không có URI âm thanh để chuyển đổi');
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
      // Kiểm tra file tồn tại
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('File âm thanh không tồn tại');
      }
      console.log('Thông tin file:', fileInfo);

      // Sử dụng API mới của AssemblyAI để upload
      console.log('Bắt đầu upload audio tới AssemblyAI...');

      // Chuyển thành upload file audio lên firebase

      //   const audioUrl = uploadResponse.data.upload_url;
      const audioUrl = 'https://firebasestorage.googleapis.com/v0/b/file-storage-6ac01.appspot.com/o/tinder%2Ftest.m4a?alt=media&token=27a2f30d-3411-4e6d-83c3-7c98f0bb4ba8';
      console.log('Đã upload file, audioUrl:', audioUrl);

      // Tạo transcript với audio_url và ngôn ngữ tiếng Việt
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
      setTranscriptionId(transcriptId);
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
          setTranscribedText(text || 'Không phát hiện nội dung giọng nói nào.');
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

  // Hàm phát lại âm thanh đã ghi
  const playRecording = async () => {
    try {
      if (!soundObject) {
        if (!audioUri) {
          Alert.alert('Thông báo', 'Không có bản ghi âm để phát');
          return;
        }

        // Tạo sound object mới từ URI
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSoundObject(sound);
        await sound.playAsync();

        // Thêm lắng nghe sự kiện kết thúc phát
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            console.log('Phát âm thanh kết thúc');
          }
        });
      } else {
        await soundObject.playFromPositionAsync(0);
      }
    } catch (error) {
      console.log('Lỗi phát lại âm thanh:', error);
      Alert.alert('Lỗi', 'Không thể phát lại âm thanh');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Ứng dụng Chuyển đổi Giọng nói sang Văn bản</Text>
        <Text style={styles.subtitle}>Thu âm giọng nói của bạn để chuyển thành văn bản</Text>
      </View>

      <View style={styles.recordButtonContainer}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            { backgroundColor: recordingStatus === 'recording' ? '#FF4136' : '#0074D9' }
          ]}
          onPress={recordingStatus === 'recording' ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {recordingStatus === 'recording' ? 'Dừng Thu âm' : 'Bắt đầu Thu âm'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.statusText}>
          {recordingStatus === 'recording'
            ? 'Đang thu âm...'
            : recordingStatus === 'stopping'
              ? 'Đang dừng thu âm...'
              : recordingStatus === 'stopped'
                ? 'Thu âm đã dừng'
                : 'Nhấn nút để bắt đầu thu âm'}
        </Text>

        {audioUri && recordingStatus === 'stopped' && (
          <TouchableOpacity
            style={styles.playButton}
            onPress={playRecording}
          >
            <Text style={styles.playButtonText}>Phát lại thu âm</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionTitle}>Văn bản đã nhận dạng:</Text>

        {isTranscribing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0074D9" />
            <Text style={styles.loadingText}>Đang chuyển đổi âm thanh...</Text>
          </View>
        ) : (
          <ScrollView style={styles.transcriptionBox}>
            <Text style={styles.transcriptionText}>
              {transcribedText || "Văn bản nhận dạng sẽ hiện tại đây sau khi thu âm."}
            </Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
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
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  playButton: {
    marginTop: 15,
    backgroundColor: '#2ECC40',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  transcriptionContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  transcriptionBox: {
    flex: 1,
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
});