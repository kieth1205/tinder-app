import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, ActivityIndicator, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Gender, GenderPreferenceOptions, MappingGenderPreference } from '@/types';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/button/ContinueButton';
import { Picker } from '@/components/inputs';
import searchSettingService, { SearchSetting, UpdateSearchSettingDto } from '@/services/searchSettingService';

export default function SearchSettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchSettings, setSearchSettings] = useState<SearchSetting | null>(null);

  // State for form values
  const [gender, setGender] = useState<Gender | ''>('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [preferredDistance, setPreferredDistance] = useState(50);
  const [hasBio, setHasBio] = useState(false);

  // Load search settings
  const fetchSearchSettings = async () => {
    try {
      setLoading(true);
      const data = await searchSettingService.getSearchSettings();
      setSearchSettings(data);
      
      // Initialize form values from data
      if (data) {
        setGender(data.gender || '');
        setMinAge(data.ageRange?.[0] || 18);
        setMaxAge(data.ageRange?.[1] || 50);
        setPreferredDistance(data.preferredDistance || 50);
        setHasBio(data.hasBio || false);
      }
    } catch (error) {
      console.error('Error fetching search settings:', error);
      Alert.alert('Lỗi', 'Không thể tải thiết lập tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSearchSettings();
  }, []);

  // Save search settings
  const saveSearchSettings = async () => {
    try {
      setSaving(true);
      
      const updateData: UpdateSearchSettingDto = {
        gender: gender as Gender || undefined,
        ageRange: [minAge, maxAge],
        preferredDistance,
        hasBio
      };

      await searchSettingService.updateSearchSettings(updateData);
      Alert.alert('Thành công', 'Lưu thiết lập tìm kiếm thành công');
      await fetchSearchSettings(); // Refresh data
    } catch (error) {
      console.error('Error saving search settings:', error);
      Alert.alert('Lỗi', 'Không thể lưu thiết lập tìm kiếm');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4C6D" />
          <Text style={styles.loadingText}>Đang tải thiết lập...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thiết lập tìm kiếm</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chọn tìm kiếm</Text>
          <Text style={styles.sectionSubtitle}>
            Chỉnh sửa thiết lập để thấy những người phù hợp với bạn hơn
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Quan tâm đến giới tính</Text>
            <Picker
              value={gender}
              setValue={setGender as (value: string) => void}
              options={GenderPreferenceOptions}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Khoảng độ tuổi</Text>
            <View style={styles.ageRangeContainer}>
              <Text style={styles.ageRangeLabel}>Tuổi tối thiểu: {minAge}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={70}
                  value={minAge}
                  onValueChange={(value) => {
                    const newValue = Math.round(value);
                    setMinAge(newValue);
                    if (newValue > maxAge) {
                      setMaxAge(newValue);
                    }
                  }}
                  minimumTrackTintColor="#FF4458"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#FF4458"
                  step={1}
                />
              </View>
              
              <Text style={styles.ageRangeLabel}>Tuổi tối đa: {maxAge}</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={70}
                  value={maxAge}
                  onValueChange={(value) => {
                    const newValue = Math.round(value);
                    setMaxAge(newValue);
                    if (newValue < minAge) {
                      setMinAge(newValue);
                    }
                  }}
                  minimumTrackTintColor="#FF4458"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#FF4458"
                  step={1}
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Khoảng cách tối đa</Text>
            <View style={styles.distanceContainer}>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={100}
                  value={preferredDistance}
                  onValueChange={setPreferredDistance}
                  minimumTrackTintColor="#FF4458"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#FF4458"
                />
                <View style={styles.valueContainer}>
                  <Text style={styles.currentValue}>{Math.round(preferredDistance)} km</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.fieldLabel}>Chỉ hiển thị hồ sơ có tiểu sử</Text>
              <Switch
                trackColor={{ false: '#e0e0e0', true: '#ffb6c1' }}
                thumbColor={hasBio ? '#FF4C6D' : '#f4f3f4'}
                onValueChange={setHasBio}
                value={hasBio}
              />
            </View>
            <Text style={styles.fieldHint}>
              Khi bật, bạn sẽ chỉ thấy những người dùng đã cập nhật tiểu sử của họ
            </Text>
          </View>
        </View>

        <Button
          title={saving ? 'Đang lưu...' : 'Lưu thiết lập'}
          onPress={saveSearchSettings}
          disabled={saving}
          style={styles.saveButton}
        />
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  ageRangeContainer: {
    marginTop: 10,
  },
  ageRangeLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  currentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4458",
  },
  distanceContainer: {
    marginBottom: 10,
  },
  saveButton: {
    margin: 20,
    backgroundColor: '#FF4C6D',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
