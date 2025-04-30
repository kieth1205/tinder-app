import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/context/AuthProvider';
import { Button } from '@/components/button/ContinueButton';
import userService, { User, UpdateProfileDto } from '@/services/userService';
import * as ImagePicker from 'expo-image-picker';

// Import components for each section
import PhotosSection from '@/components/profile/PhotosSection';
import BasicInfoSection from '@/components/profile/BasicInfoSection';
import InterestsSection from '@/components/profile/InterestsSection';
import PreferencesSection from '@/components/profile/PreferencesSection';
import AboutSection from '@/components/profile/AboutSection';
import LifestyleSection from '@/components/profile/LifestyleSection';

interface MediaItem {
  uri: string;
  type: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

export default function ProfileScreen() {
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Basic info
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState('');
  const [rawProfile, setRawProfile] = useState('');
  
  // Photos
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Preferences
  const [lookingFor, setLookingFor] = useState('');
  const [distance, setDistance] = useState(50);
  
  // About
  const [zodiac, setZodiac] = useState('');
  const [education, setEducation] = useState('');
  const [loveLanguage, setLoveLanguage] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');
  
  // Lifestyle
  const [pet, setPet] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('');
  const [smoking, setSmoking] = useState('');
  const [exerciseHabit, setExerciseHabit] = useState('');
  const [diet, setDiet] = useState('');
  const [socialMediaActivity, setSocialMediaActivity] = useState('');
  const [sleepHabit, setSleepHabit] = useState('');
  
  // Load user profile
  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getProfile();
      setUser(profileData);
      // Initialize basic info fields
      setName(profileData.name || '');
      setBirthday(profileData.birthday ? new Date(profileData.birthday) : undefined);
      setGender(profileData.gender || '');
      
      // Initialize photos
      setImages(profileData.images || []);
      
      // Initialize interests
      setSelectedInterests(profileData.interests || []);
      
      // Initialize preferences
      setLookingFor(profileData.lookingFor || '');
      setDistance(profileData.preferredDistance || 50);
      
      // Initialize about fields
      setZodiac(profileData.zodiac || '');
      setEducation(profileData.education || '');
      setLoveLanguage(profileData.loveLanguage || '');
      setCommunicationStyle(profileData.communicationStyle || '');
      
      // Initialize lifestyle fields
      setPet(profileData.pet || '');
      setAlcoholConsumption(profileData.alcoholConsumption || '');
      setSmoking(profileData.smoking || '');
      setExerciseHabit(profileData.exerciseHabit || '');
      setDiet(profileData.diet || '');
      setSocialMediaActivity(profileData.socialMediaActivity || '');
      setSleepHabit(profileData.sleepHabit || '');
      setRawProfile(profileData.rawProfile || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    if (authUser) {
      loadProfile();
    }
  }, [authUser]);
  
  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };
  
  // Handle media selection
  // Chọn ảnh từ thư viện
  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    try {
      // Yêu cầu quyền truy cập thư viện ảnh
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Cần cấp quyền', 'Bạn cần cấp quyền truy cập thư viện ảnh để tiếp tục.');
        return;
      }
      
      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      // Nếu người dùng không hủy việc chọn ảnh
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Kiểm tra kích thước file (giới hạn 5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('Lỗi', 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.');
          return;
        }
        
        // Tạo đối tượng MediaItem mới
        const newMedia: MediaItem = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `photo-${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        };
        
        // Cập nhật danh sách ảnh đã chọn
        setSelectedMedia([...selectedMedia, newMedia]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };
  
  // Lưu thông tin hồ sơ
  const saveProfile = async () => {
    try {
      setSaving(true);
      
      let updatedImages = images;
      
      // Upload ảnh mới nếu có
      if (selectedMedia.length > 0) {
        const mediaFiles = selectedMedia.map(item => ({
          uri: item.uri,
          type: item.type || 'image/jpeg',
          name: item.name || `photo-${Date.now()}.jpg`,
        }));
        
        const uploadResult = await userService.uploadPhotos(mediaFiles);
        
        // Kết hợp ảnh hiện tại và ảnh mới
        updatedImages = [...images, ...uploadResult.urls];
      }
      
      // Chuẩn bị dữ liệu cập nhật
      const updateData: UpdateProfileDto = {
        images: updatedImages,
        interests: selectedInterests,
        lookingFor,
        preferredDistance: Math.round(distance),
        zodiac,
        education,
        loveLanguage,
        communicationStyle,
        pet,
        alcoholConsumption,
        smoking,
        exerciseHabit,
        diet,
        socialMediaActivity,
        sleepHabit,
        rawProfile,
      };
      
      // Gửi cập nhật lên API
      await userService.updateProfile(updateData);
      
      // Làm mới thông tin hồ sơ
      await loadProfile();
      // await checkAuth();
      
      Alert.alert('Thành công', 'Cập nhật thông tin thành công');
      setEditMode(false);
      setSelectedMedia([]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };
  
  // Bật/tắt chế độ chỉnh sửa
  const toggleEditMode = () => {
    if (editMode) {
      // Hủy chỉnh sửa và khôi phục giá trị ban đầu
      if (user) {
        setName(user.name || '');
        // setBirthday(user.birthday ? new Date(user.birthday) : undefined);
        // setGender(user.gender || '');
        setImages(user.images || []);
        setSelectedInterests(user.interests || []);
        setLookingFor(user.lookingFor || '');
        setDistance(user.preferredDistance || 50);
        setZodiac(user.zodiac || '');
        setEducation(user.education || '');
        setLoveLanguage(user.loveLanguage || '');
        setCommunicationStyle(user.communicationStyle || '');
        setPet(user.pet || '');
        setAlcoholConsumption(user.alcoholConsumption || '');
        setSmoking(user.smoking || '');
        setExerciseHabit(user.exerciseHabit || '');
        setDiet(user.diet || '');
        setSocialMediaActivity(user.socialMediaActivity || '');
        setSleepHabit(user.sleepHabit || '');
        setRawProfile(user.rawProfile || '');
      }
      setSelectedMedia([]);
    }
    setEditMode(!editMode);
  };
  
  // Xóa ảnh
  const removePhoto = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4C6D" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Hồ sơ của tôi</Text>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={toggleEditMode}
            >
              <Text style={styles.editButtonText}>
                {editMode ? 'Hủy' : 'Chỉnh sửa'}
              </Text>
              {editMode ? 
                <MaterialIcons name="close" size={20} color="#FF4C6D" /> : 
                <FontAwesome name="edit" size={20} color="#FF4C6D" />
              }
            </TouchableOpacity>
          </View>
          
          {/* Ảnh hồ sơ */}
          {user && (
            <PhotosSection 
              user={user}
              editMode={editMode}
              images={images}
              removePhoto={removePhoto}
              pickImage={pickImage}
            />
          )}
          
          {/* Thông tin cơ bản */}
          {user && (
            <BasicInfoSection
              user={user}
              editMode={editMode}
              name={name}
              setName={setName}
              rawProfile={rawProfile}
              setRawProfile={setRawProfile}
            />
          )}
          
          {/* Sở thích */}
          {user && (
            <InterestsSection
              user={user}
              editMode={editMode}
              selectedInterests={selectedInterests}
              setSelectedInterests={setSelectedInterests}
            />
          )}
          
          {/* Tùy chọn tìm kiếm */}
          {user && (
            <PreferencesSection
              user={user}
              editMode={editMode}
              lookingFor={lookingFor}
              setLookingFor={setLookingFor}
              preferredDistance={distance}
              setDistance={setDistance}
            />
          )}
          
          {/* Thông tin về bạn */}
          {user && (
            <AboutSection
              user={user}
              editMode={editMode}
              zodiac={zodiac}
              setZodiac={setZodiac}
              education={education}
              setEducation={setEducation}
              loveLanguage={loveLanguage}
              setLoveLanguage={setLoveLanguage}
              communicationStyle={communicationStyle}
              setCommunicationStyle={setCommunicationStyle}
            />
          )}
          
          {/* Lối sống */}
          {user && (
            <LifestyleSection
              user={user}
              editMode={editMode}
              pet={pet}
              setPet={setPet}
              alcoholConsumption={alcoholConsumption}
              setAlcoholConsumption={setAlcoholConsumption}
              smoking={smoking}
              setSmoking={setSmoking}
              exerciseHabit={exerciseHabit}
              setExerciseHabit={setExerciseHabit}
              diet={diet}
              setDiet={setDiet}
              socialMediaActivity={socialMediaActivity}
              setSocialMediaActivity={setSocialMediaActivity}
              sleepHabit={sleepHabit}
              setSleepHabit={setSleepHabit}
            />
          )}
          
          {/* Nút lưu thay đổi */}
          {editMode && (
            <Button
              title={saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              onPress={saveProfile}
              disabled={saving}
              style={styles.saveButton}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FF4C6D',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 5,
  },
  saveButton: {
    margin: 20,
    backgroundColor: '#FF4C6D',
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
  }
});
