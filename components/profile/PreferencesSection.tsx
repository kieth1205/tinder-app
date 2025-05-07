import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/services/userService';
import Slider from '@react-native-community/slider';
import { LOOKING_FOR, MappingLookingFor } from '@/types';
import { Picker } from '../inputs';

interface PreferencesSectionProps {
  user: User;
  editMode: boolean;
  lookingFor: string;
  setLookingFor: (value: string) => void;
  preferredDistance: number;
  setDistance: (value: number) => void;
}

export default function PreferencesSection({
  user,
  editMode,
  lookingFor,
  setLookingFor,
  preferredDistance,
  setDistance
}: PreferencesSectionProps) {
  
  const lookingForOptions = [
    {
      id: "NGUOI_YEU",
      label: "Người yêu",
    },
    {
      id: "HEN_HO_LAU_DAI",
      label: "Bạn hẹn hò lâu dài",
    },
    {
      id: "BAT_KI_DIEU_GI_CO_THE",
      label: "Bất kì điều gì có thể",
    },
    {
      id: "QUAN_HE_KHONG_RANG_BUOC",
      label: "Quan hệ không ràng buộc",
    },
    {
      id: "NHUNG_NGUOI_BAN_MOI",
      label: "Những người bạn mới",
    },
    {
      id: "CHUA_RO",
      label: "Mình cũng chưa rõ lắm",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tùy chọn tìm kiếm</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Đang tìm kiếm</Text>
        {editMode ? (
          <Picker
            value={lookingFor}
            setValue={setLookingFor}
            options={lookingForOptions}
          />
        ) : (
          <Text style={styles.fieldValue}>
            {MappingLookingFor[user?.lookingFor as LOOKING_FOR]}
          </Text>
        )}
      </View>
      
      {/* <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Khoảng cách tối đa</Text>
        <View>
          {editMode ? (
            <View style={styles.distanceContainer}>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={100}
                  value={preferredDistance}
                  onValueChange={setDistance}
                  minimumTrackTintColor="#FF4458"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#FF4458"
                />
                <View style={styles.valueContainer}>
                  <Text style={styles.currentValue}>{preferredDistance.toFixed(0)} km</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.fieldValue}>
              {user?.preferredDistance ? `${user.preferredDistance} km` : 'Chưa cập nhật'}
            </Text>
          )}
        </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  distanceValue: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },

  distanceContainer: {
    marginBottom: 30,
  },
  sliderContainer: {
    marginVertical: 20,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  minValue: {
    fontSize: 12,
    color: "#666",
  },
  currentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4458",
  },
  pickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  pickerButtonText: {
    color: '#666',
  },
  pickerButtonTextSelected: {
    color: 'white',
  },
  pickerButtonSelected: {
    backgroundColor: '#FF4C6D',
    borderColor: '#FF4C6D',
  }
});
