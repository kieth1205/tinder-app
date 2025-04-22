  import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Platform,
  } from "react-native";
  import React, { useState } from "react";
  import { ProgressBar } from "@/components/progress-bar/ProgressBar";
  import { AuthHeader } from "@/components/AuthHeader";
  import { router } from "expo-router";
  import { Button } from "@/components/button/ContinueButton";
  import { STEPS, TOTAL_STEPS } from "./_layout";
  import { MediaUploader } from "@/components/inputs/MediaUploader";
  import { useRegistration } from "@/context/RegistrationContext";
  import api, { API_BASE_URL } from "@/services/api";
  import * as FileSystem from 'expo-file-system'

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
        // Chuẩn bị dữ liệu ảnh cho API upload với xử lý tốt hơn cho URI
        const mediaFiles = await Promise.all(selectedMedia.map(async (item, index) => {
          // Xác định đúng kiểu MIME nếu không có
          const type = item.type || (item.uri.endsWith('.png') ? 'image/png' : 'image/jpeg');
          
          // Tạo tên file duy nhất nếu không có
          const name = item.name || `photo-${Date.now()}-${index}.${type.split('/')[1]}`;
          
          // Xử lý URI cho Android (content:// URI) và iOS
          let uri = item.uri;
          if (Platform.OS === 'android' && !uri.startsWith('file://')) {
            // Giữ nguyên content:// URI cho Android
            uri = item.uri;
          } else if (Platform.OS === 'ios') {
            // Xử lý cho iOS nếu cần
            uri = item.uri.replace('file://', '');
          }
                  
          return {
            uri,
            type,
            name,
          };
        }));
        
        
        const uploadResults = await Promise.all(mediaFiles.map(async (file) => {
          const uploadResult = await FileSystem.uploadAsync(
            API_BASE_URL + '/upload/single',
            file.uri,
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

          return body?.url as string;
        }));
      
        console.log("uploadResults", uploadResults)
    
        // Xử lý kết quả thành công
        if (uploadResults && uploadResults.length > 0) {
          const photoUrls = uploadResults;
          setUploadedPhotos(photoUrls);
          console.log("Photos uploaded successfully:", photoUrls);
    
          // Cập nhật dữ liệu đăng ký
          updateRegistrationData('images', photoUrls);
          
          // Chuyển đến bước tiếp theo
          router.push("/register/ProfilePassStep");
        } else {
          throw new Error('Không nhận được URL ảnh từ server hoặc mảng URLs trống');
        }
      } catch (error: any) {
        console.error("Photo upload error:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = "Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.";
        
        if (error.message?.includes('network-request-failed')) {
          errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.";
        } else if (error.message?.includes('timeout')) {
          errorMessage = "Quá thời gian tải lên. Có thể do kết nối mạng chậm hoặc file quá lớn.";
        } else if (error.response?.status === 413) {
          errorMessage = "File ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn.";
        } else if (error.response?.status === 415) {
          errorMessage = "Định dạng ảnh không được hỗ trợ. Vui lòng chọn ảnh định dạng JPEG hoặc PNG.";
        }
        
        Alert.alert("Lỗi tải lên", errorMessage);
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
              // disabled={selectedMedia.length < 2}
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
