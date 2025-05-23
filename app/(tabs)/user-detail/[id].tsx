import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { ALCOHOL_CONSUMPTION, COMMUNICATION_STYLE, DIETARY_PREFERENCE, EDUCATION, EXERCISE_FREQUENCY, GENDER, INTEREST, LOOKING_FOR, LOVE_LANGUAGE, MappingAlcoholConsumption, MappingCommunicationStyle, MappingDietaryPreference, MappingEducation, MappingExercise, MappingGender, MappingInterest, MappingLookingFor, MappingLoveLanguage, MappingPets, MappingSleepPattern, MappingSmokingPreference, MappingSocialMediaUsage, MappingZodiacSign, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE, UserSuggestion, ZODIAC_SIGN } from '@/types';
import { useGetInterestMatches, useGetMatches } from '@/hooks/use-get-matches';
import messageService from '@/services/messageService';
import { AuthContext } from '@/context/AuthProvider';
import useVipStatus from '@/hooks/useVipStatus';

export default function UserDetailScreen() {
  const { id, interestId } = useLocalSearchParams<{ id: string, interestId?: string }>();
  const router = useRouter();
  
  const { data: users, isLoading } = useGetMatches();
  const { data: usersInterest, isLoading: isLoadingMatches } = useGetInterestMatches(interestId);
  
  const [user, setUser] = useState<UserSuggestion | null>(null);
  const { user: currentUser } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const { isVip, refreshVipStatus } = useVipStatus();

  useEffect(() => {
    if ((users || usersInterest) && id) {
      const foundUser = users?.find(u => u.id === id)
      if (foundUser) {
        setUser(foundUser);
      }

      const foundUserInterest = usersInterest?.find(u => u.id === id)
      if (foundUserInterest) {
        setUser(foundUserInterest as unknown as UserSuggestion);
      }
    }
  }, [id, users, usersInterest]);

  useEffect(() => {
    refreshVipStatus();
  }, []);

  if (isLoading || isLoadingMatches) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4458" />
        <Text style={styles.loadingText}>Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
      </SafeAreaView>
    );
  }

  const startConversation = async () => {
    if (!message.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung tin nhắn');
      return;
    }

    if (!currentUser?.id) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để gửi tin nhắn');
      return;
    }

    try {
      setSendingMessage(true);

      const result = await messageService.startConversation(
        user.id,
        message.trim()
      );

      if (result) {
        setModalVisible(false);
        setMessage('');

        // Chuyển đến màn hình chat với người dùng này
        router.push({
          pathname: '/(tabs)/chat/[id]',
          params: {
            id: user.id,
            userId: currentUser.id,
            name: user.name,
            avatar: user.images[0]
          }
        });
      } else {
        Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isVip && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Gửi tin nhắn cho {user.name}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AntDesign name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.messageInput}
                placeholder="Nhập tin nhắn..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                style={styles.sendButton}
                onPress={startConversation}
                disabled={sendingMessage}
              >
                {sendingMessage ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Gửi tin nhắn</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView style={styles.scrollView}>
        {/* Header với nút back */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin chi tiết</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Ảnh đại diện và thông tin cơ bản */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.images[0] }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            {user.gender && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="gender-male-female" size={18} color="#777" />
                <Text style={styles.infoText}>{MappingGender[user.gender as GENDER]}</Text>
              </View>
            )}
            {/* <View style={styles.infoRow}>
              <Ionicons name="flame" size={18} color="#FF4458" />
              <Text style={styles.infoText}>Điểm tương hợp: {user.similarityScore}%</Text>
            </View> */}
          </View>
        </View>

        {/* Sở thích */}
        {user.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sở thích</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{MappingInterest[interest as INTEREST]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Thông tin bổ sung */}
        {user.additionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
            <View style={styles.additionalInfoContainer}>
              {user.additionalInfo.education && (
                <View style={styles.infoItem}>
                  <FontAwesome5 name="graduation-cap" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Học vấn: </Text>
                    {MappingEducation[user.additionalInfo.education as EDUCATION]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.zodiac && (
                <View style={styles.infoItem}>
                  <FontAwesome5 name="star" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Cung hoàng đạo: </Text>
                    {MappingZodiacSign[user.additionalInfo.zodiac as ZODIAC_SIGN]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.loveLanguage && (
                <View style={styles.infoItem}>
                  <Ionicons name="heart" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Ngôn ngữ tình yêu: </Text>
                    {MappingLoveLanguage[user.additionalInfo.loveLanguage as LOVE_LANGUAGE]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.pet && (
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="dog" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Thú cưng: </Text>
                    {MappingPets[user.additionalInfo.pet as PETS]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.alcoholConsumption && (
                <View style={styles.infoItem}>
                  <FontAwesome5 name="wine-glass-alt" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Uống rượu: </Text>
                    {MappingAlcoholConsumption[user.additionalInfo.alcoholConsumption as ALCOHOL_CONSUMPTION]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.smoking && (
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="smoking" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Hút thuốc: </Text>
                    {MappingSmokingPreference[user.additionalInfo.smoking as SMOKING_PREFERENCE]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.exerciseHabit && (
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="run" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Tập thể dục: </Text>
                    {MappingExercise[user.additionalInfo.exerciseHabit as EXERCISE_FREQUENCY]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.diet && (
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="food-apple" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Chế độ ăn uống: </Text>
                    {MappingDietaryPreference[user.additionalInfo.diet as DIETARY_PREFERENCE]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.socialMediaActivity && (
                <View style={styles.infoItem}>
                  <FontAwesome5 name="instagram" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Mạng xã hội: </Text>
                    {MappingSocialMediaUsage[user.additionalInfo.socialMediaActivity as SOCIAL_MEDIA_USAGE]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.sleepHabit && (
                <View style={styles.infoItem}>
                  <Ionicons name="moon" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Thói quen ngủ: </Text>
                    {MappingSleepPattern[user.additionalInfo.sleepHabit as SLEEP_PATTERN]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.communicationStyle && (
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="message-text" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Phong cách giao tiếp: </Text>
                    {MappingCommunicationStyle[user.additionalInfo.communicationStyle as COMMUNICATION_STYLE]}
                  </Text>
                </View>
              )}

              {user.additionalInfo.lookingFor && (
                <View style={styles.infoItem}>
                  <Ionicons name="search" size={16} color="#777" />
                  <Text style={styles.infoDetailText}>
                    <Text style={styles.infoLabel}>Đang tìm kiếm: </Text>
                    {MappingLookingFor[user.additionalInfo.lookingFor as LOOKING_FOR]}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Thư viện ảnh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thư viện ảnh</Text>
          <View style={styles.galleryContainer}>
            {user.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.galleryImage}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Nút bắt đầu trò chuyện */}
      {isVip && (
        <View style={styles.chatButtonContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
            <Text style={styles.chatButtonText}>Bắt đầu trò chuyện</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#777',
    marginTop: 10,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FF4458',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: 'center',
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  interestText: {
    color: '#333',
    fontSize: 14,
  },
  additionalInfoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoDetailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    borderRadius: 8,
    width: 100,
    height: 100,
  },
  chatButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#FF4458',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#FF4458',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 16,
  },
  footerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dislikeButton: {
    backgroundColor: '#FF6B6B',
  },
  likeButton: {
    backgroundColor: '#2ECC71',
  },
  superLikeButton: {
    backgroundColor: '#3498DB',
  },
});
