import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/services/userService';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { LOOKING_FOR, MappingLookingFor } from '@/types';

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
    { value: 'NAM', label: 'Nam' },
    { value: 'NU', label: 'Nữ' },
    { value: 'CA_HAI', label: 'Cả hai' }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Tùy chọn tìm kiếm</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Đang tìm kiếm</Text>
        {editMode ? (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={lookingFor}
              onValueChange={(itemValue) => setLookingFor(itemValue)}
              style={styles.picker}
            >
              {lookingForOptions.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        ) : (
          <Text style={styles.fieldValue}>
            {MappingLookingFor[user?.lookingFor as LOOKING_FOR]}
          </Text>
        )}
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Khoảng cách tối đa</Text>
        <View>
          {editMode ? (
            <View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={preferredDistance}
                onValueChange={setDistance}
                minimumTrackTintColor="#FF4C6D"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#FF4C6D"
              />
              <Text style={styles.distanceValue}>{Math.round(preferredDistance)} km</Text>
            </View>
          ) : (
            <Text style={styles.fieldValue}>
              {user?.preferredDistance ? `${user.preferredDistance} km` : 'Chưa cập nhật'}
            </Text>
          )}
        </View>
      </View>
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
  }
});
