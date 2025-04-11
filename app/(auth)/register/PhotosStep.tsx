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
  
  // API endpoint for photo upload - would come from your backend config
  const UPLOAD_URL = "https://your-backend-api.com/upload-photos";

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
      // Create FormData for upload
      const formData = new FormData();

      selectedMedia.forEach((item, index) => {
        formData.append('files', {
          uri: item.uri,
          type: 'image/jpeg',
          name: item.name,
        } as any);
      });

      // Perform actual upload
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle successful upload
      if (result && result.photoUrls) {
        setUploadedPhotos(result.photoUrls);
        console.log("Photos uploaded successfully:", result.photoUrls);

        updateRegistrationData('images', result.photoUrls);

        // Navigate to next step
        router.push("/register/SuccessStep");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      Alert.alert(
        "Lỗi tải lên",
        "Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại."
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
