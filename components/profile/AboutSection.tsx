import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/services/userService';
import { Picker } from '@react-native-picker/picker';
import { COMMUNICATION_STYLE, EDUCATION, LOVE_LANGUAGE, MappingCommunicationStyle, MappingEducation, MappingLoveLanguage, MappingZodiacSign, ZODIAC_SIGN } from '@/types';

interface AboutSectionProps {
  user: User;
  editMode: boolean;
  zodiac: string;
  setZodiac: (value: string) => void;
  education: string;
  setEducation: (value: string) => void;
  loveLanguage: string;
  setLoveLanguage: (value: string) => void;
  communicationStyle: string;
  setCommunicationStyle: (value: string) => void;
}

export default function AboutSection({
  user,
  editMode,
  zodiac,
  setZodiac,
  education,
  setEducation,
  loveLanguage,
  setLoveLanguage,
  communicationStyle,
  setCommunicationStyle
}: AboutSectionProps) {
  // Zodiac options
  const zodiacOptions = [
    { value: 'BAO_BINH', label: 'Bảo Bình' },
    { value: 'SONG_NGU', label: 'Song Ngư' },
    { value: 'BACH_DUONG', label: 'Bạch Dương' },
    { value: 'KIM_NGUU', label: 'Kim Ngưu' },
    { value: 'SONG_TU', label: 'Song Tử' },
    { value: 'CU_GIAI', label: 'Cự Giải' },
    { value: 'SU_TU', label: 'Sư Tử' },
    { value: 'XU_NU', label: 'Xử Nữ' },
    { value: 'THIEN_BINH', label: 'Thiên Bình' },
    { value: 'BO_CAP', label: 'Bọ Cạp' },
    { value: 'NHAN_MA', label: 'Nhân Mã' },
    { value: 'MA_KET', label: 'Ma Kết' }
  ];

  // Education options
  const educationOptions = [
    { value: 'TRUNG_HOC', label: 'Trung học' },
    { value: 'CAO_DANG', label: 'Cao đẳng' },
    { value: 'DAI_HOC', label: 'Đại học' },
    { value: 'SAU_DAI_HOC', label: 'Sau đại học' }
  ];

  // Love languages
  const loveLanguageOptions = [
    { value: 'WORDS_OF_AFFIRMATION', label: 'Lời nói trân trọng' },
    { value: 'QUALITY_TIME', label: 'Thời gian chất lượng' },
    { value: 'RECEIVING_GIFTS', label: 'Nhận quà tặng' },
    { value: 'ACTS_OF_SERVICE', label: 'Sự giúp đỡ' },
    { value: 'PHYSICAL_TOUCH', label: 'Tiếp xúc thân thể' }
  ];

  // Communication styles
  const communicationStyleOptions = [
    { value: 'BIG_LAUGHS', label: 'Thích cười lớn' },
    { value: 'PHONE_CALLS', label: 'Thích gọi điện' },
    { value: 'VIDEO_CHAT', label: 'Chat video' },
    { value: 'TEXT_FIRST', label: 'Nhắn tin trước' }
  ];

  const getOptionLabel = (value: string | undefined, options: {value: string, label: string}[]) => {
    if (!value) return 'Chưa cập nhật';
    const option = options.find(o => o.value === value);
    return option ? option.label : value;
  };

  const renderPicker = (
    value: string, 
    setValue: (value: string) => void, 
    options: {value: string, label: string}[]
  ) => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => setValue(itemValue)}
        style={styles.picker}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Về bạn</Text>
      
      {/* Zodiac */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Cung hoàng đạo</Text>
        {editMode 
          ? renderPicker(zodiac, setZodiac, zodiacOptions)
          : <Text style={styles.fieldValue}>{MappingZodiacSign[user?.zodiac as ZODIAC_SIGN]}</Text>
        }
      </View>
      
      {/* Education */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Trình độ học vấn</Text>
        {editMode 
          ? renderPicker(education, setEducation, educationOptions)
          : <Text style={styles.fieldValue}>{MappingEducation[user?.education as EDUCATION]}</Text>
        }
      </View>
      
      {/* Love Language */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Ngôn ngữ tình yêu</Text>
        {editMode 
          ? renderPicker(loveLanguage, setLoveLanguage, loveLanguageOptions)
          : <Text style={styles.fieldValue}>{MappingLoveLanguage[user?.loveLanguage as LOVE_LANGUAGE]}</Text>
        }
      </View>
      
      {/* Communication Style */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Phong cách giao tiếp</Text>
        {editMode 
          ? renderPicker(communicationStyle, setCommunicationStyle, communicationStyleOptions)
          : <Text style={styles.fieldValue}>{MappingCommunicationStyle[user?.communicationStyle as COMMUNICATION_STYLE]}</Text>
        }
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
  }
});
