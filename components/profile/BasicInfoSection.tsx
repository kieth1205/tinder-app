import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { User } from '@/services/userService';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GENDER } from '@/types';

interface BasicInfoSectionProps {
  user: User;
  editMode: boolean;
  name: string;
  setName: (value: string) => void;
  birthday: Date | undefined;
  setBirthday: (value: Date) => void;
  gender: string;
  setGender: (value: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
}

export default function BasicInfoSection({
  user,
  editMode,
  name,
  setName,
  birthday,
  setBirthday,
  gender,
  setGender,
  showDatePicker,
  setShowDatePicker
}: BasicInfoSectionProps) {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Chưa cập nhật';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const genderOptions = [
    { value: 'NAM', label: 'Nam' },
    { value: 'NU', label: 'Nữ' },
    { value: 'KHAC', label: 'Khác' }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tên</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên của bạn"
          />
        ) : (
          <Text style={styles.fieldValue}>{user?.name}</Text>
        )}
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Email</Text>
        <Text style={styles.fieldValue}>{user?.email}</Text>
      </View>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Ngày sinh</Text>
        <Text style={styles.fieldValue}>
          {user?.birthday ? formatDate(user.birthday) : 'Chưa cập nhật'}
        </Text>
       </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Giới tính</Text>
        {editMode ? (
          <View style={styles.optionsContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderOption,
                  gender === option.value && styles.selectedOption,
                ]}
                onPress={() => setGender(option.value as GENDER)}
              >
                <Text
                  style={[
                    styles.optionText,
                    gender === option.value && styles.selectedText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.fieldValue}>
            {user?.gender === 'MALE' ? 'Nam' : 
             user?.gender === 'FEMALE' ? 'Nữ' : 
             user?.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
          </Text>
        )}
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
    marginBottom: 12,
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
  datePickerButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  datePickerText: {
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
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#FF4C6D',
    borderColor: '#FF4C6D',
  },
  optionText: {
    color: '#666',
  },
  selectedText: {
    color: "#fff",
  },
});
