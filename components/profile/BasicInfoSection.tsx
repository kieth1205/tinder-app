import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { User } from '@/services/userService';

interface BasicInfoSectionProps {
  user: User;
  editMode: boolean;
  name: string;
  setName: (value: string) => void;
  rawProfile: string;
  setRawProfile: (value: string) => void;
}

export default function BasicInfoSection({
  user,
  editMode,
  name,
  setName,
  rawProfile,
  setRawProfile
}: BasicInfoSectionProps) {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'Chưa cập nhật';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN');
  };

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
        <Text style={styles.fieldLabel}>Mô tả bản thân</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={rawProfile}
            onChangeText={setRawProfile}
            placeholder="Nhập mô tả về bạn"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        ) : (
          <Text style={styles.fieldValue}>{user?.rawProfile}</Text>
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
        <Text style={styles.fieldValue}>
            {user?.gender === 'MALE' ? 'Nam' : 
             user?.gender === 'FEMALE' ? 'Nữ' : 
             user?.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
          </Text>
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
