import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Các thẻ sở thích
const CATEGORIES = [
  {
    id: 'relationship_goals',
    title: 'Hẹn hò chung mục đích',
    subtitle: 'Tìm kiếm những người có chung mục đích hẹn hò',
    interests: [
      { id: 'NGUOI_YEU', label: 'Người yêu', count: '2.7N', color: '#C183FF', iconType: 'ionicons', iconName: 'heart' },
      { id: 'HEN_HO_NGHIEM_TUC', label: 'Hẹn hò nghiêm túc', count: '1.5N', color: '#FF7864', iconType: 'ionicons', iconName: 'heart-half' },
      { id: 'RANH_TOI_NAY', label: 'Rảnh tối nay', count: '1.2N', color: '#5D6EFF', iconType: 'ionicons', iconName: 'moon' },
      { id: 'QUAN_HE_KHONG_RANG_BUOC', label: 'Mối quan hệ không ràng buộc', count: '1.2N', color: '#C183FF', iconType: 'ionicons', iconName: 'flower' },
    ]
  },
  {
    id: 'shared_interests',
    title: 'Chia sẻ sở thích chung',
    subtitle: 'Tìm kiếm những người có sở thích giống bạn',
    interests: [
      { id: 'HOI_ME_PHIM', label: 'Hội mê Phim', count: '1.6N', color: '#C183FF', iconType: 'ionicons', iconName: 'eye' },
      { id: 'THICH_DI_NHAU', label: 'Thích đi nhậu', count: '388', color: '#C183FF', iconType: 'ionicons', iconName: 'beer' },
      { id: 'CHAM_SOC_BAN_THAN', label: 'Chăm sóc bản thân', count: '1.7N', color: '#C183FF', iconType: 'fa5', iconName: 'bath' },
      { id: 'DU_LICH', label: 'Du lịch', count: '1.8N', color: '#FF7864', iconType: 'ionicons', iconName: 'airplane' },
      { id: "YEU_THE_THAO", label: 'Yêu theo thể thao', count: '1.8N', color: '#2DC8FF', iconType: 'ionicons', iconName: 'trophy' },
      { id: "YEU_THU_CUNG", label: 'Yêu thú cưng', count: '1.8N', color: '#2DC8FF', iconType: 'ionicons', iconName: 'paw' },
      { id: "YEU_SACH", label: 'Yêu sách', count: '1.8N', color: '#5D6EFF', iconType: 'ionicons', iconName: 'book' },
    ]
  },
];

export default function InterestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const renderIcon = (interest: any) => {
    if (!interest.iconType || !interest.iconName) return null;

    switch (interest.iconType) {
      case 'ionicons':
        return <Ionicons name={interest.iconName} size={50} color="white" style={styles.icon} />;
      case 'material':
        return <MaterialCommunityIcons name={interest.iconName} size={50} color="white" style={styles.icon} />;
      case 'fa5':
        return <FontAwesome5 name={interest.iconName} size={50} color="white" style={styles.icon} />;
      default:
        return null;
    }
  };

  const handleInterestSelect = (interestId: string) => {
    router.push({
      pathname: '/(tabs)/interests/matches',
      params: {
        interestId,
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Interest cards */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardsContainer}>
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{category.title}</Text>
                <Text style={styles.subtitle}>{category.subtitle}</Text>
              </View>

              {category.interests.map((interest) => (
                interest.label ? (
                  <TouchableOpacity
                    key={interest.id}
                    style={[styles.card, { backgroundColor: interest.color }]}
                    onPress={() => handleInterestSelect(interest.id)}
                  >
                    <View style={styles.cardContent}>
                      {renderIcon(interest)}
                      <Text style={styles.interestLabel}>{interest.label}</Text>
                    </View>
                  </TouchableOpacity>
                ) : null
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: 120,
  },
  categoryContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    width: '48%',
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  countBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  interestLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingBottom: 20,
  },
  tab: {
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
