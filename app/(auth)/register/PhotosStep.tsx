import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { STEPS, TOTAL_STEPS } from "./_layout";
import { MediaUploader } from "@/components/inputs/MediaUploader";
import { useRegistration } from "@/context/RegistrationContext";
import api from "@/services/api";

interface MediaItem {
  uri: string;
  type: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

const PhotosStep = () => {
  const { updateRegistrationData } = useRegistration();

  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  const handleMediaSelected = (media: MediaItem[]) => {
    setSelectedMedia(media);
  };

  const uploadPhotos = async () => {
    if (selectedMedia.length === 0) {
      Alert.alert(
        "Không có ảnh",
        "Vui lòng chọn ít nhất 2 ảnh để tiếp tục"
      );
      return;
    }

    if (selectedMedia.length < 2) {
      Alert.alert(
        "Cần thêm ảnh",
        "Vui lòng chọn ít nhất 2 ảnh để tiếp tục"
      );
      return;
    }

    setUploading(true);

    try {
      // Chuẩn bị dữ liệu ảnh cho API upload
      const mediaFiles = selectedMedia.map(item => ({
        uri: item.uri,
        type: item.type || 'image/jpeg',
        name: item.name || `photo-${Date.now()}.jpg`,
      }));

      // Thực hiện tải lên qua API
      const response = await api.upload<{ urls: string[] }>(
        "/upload/multiple", // API endpoint
        mediaFiles,
        { fieldName: 'files' } // Tên field mà backend mong đợi từ FilesInterceptor
      );

      // Kiểm tra lỗi
      if (response.error) {
        throw new Error(`Upload failed: ${response.error}`);
      }
      
      // Xử lý kết quả thành công
      if (response.data?.urls) {
        // Backend trả về { urls: [...] } thay vì photoUrls
        const photoUrls = response.data.urls;
        setUploadedPhotos(photoUrls);
        console.log("Photos uploaded successfully:", photoUrls);

        // Cập nhật dữ liệu đăng ký
        updateRegistrationData('images', photoUrls);
        
        // Chuyển đến bước tiếp theo
        router.push("/register/ProfilePassStep");
      } else {
        throw new Error('Không nhận được URL ảnh từ server');
      }
    } catch (error: any) {
      console.error("Photo upload error:", error);
      Alert.alert(
        "Lỗi tải lên",
        error.message || "Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={STEPS.PhotosStep} totalSteps={TOTAL_STEPS} />
      <AuthHeader onBack={() => router.back()} />
      <Text style={styles.title}>Thêm ảnh</Text>
      <Text style={styles.subtitle}>Thêm ít nhất 2 ảnh để tiếp tục</Text>
      
      <View style={styles.uploaderContainer}>
        <MediaUploader 
          maxFiles={6}
          allowedTypes={['image']}
          maxFileSize={5 * 1024 * 1024} // 5MB limit
          onMediaSelected={handleMediaSelected}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        {uploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="#FF4458" />
            <Text style={styles.uploadingText}>Đang tải ảnh lên...</Text>
          </View>
        ) : (
          <Button 
            title="Tiếp tục" 
            gradient 
            onPress={uploadPhotos} 
            disabled={selectedMedia.length < 2}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default PhotosStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  uploaderContainer: {
    flex: 2,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 28,
    marginBottom: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  uploadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF4458',
  },
});
