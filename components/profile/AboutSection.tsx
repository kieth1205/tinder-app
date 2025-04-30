import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/services/userService';
import { Picker } from '../inputs';
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

   // Communication style options
      const communicationStyleOptions: { id: COMMUNICATION_STYLE, label: string }[] = [
          { id: "IT_NHAN_TIN", label: "Ít nhắn tin" },
          { id: "NGHIEN_NHAN_TIN", label: "Nghiện nhắn tin" },
          { id: "THICH_GAP_MAT_TRUC_TIEP", label: "Thích gặp mặt trực tiếp" },
          { id: "THICH_GOI_DIEN", label: "Thích gọi điện" },
          { id: "THICH_GOI_VIDEO", label: "Thích gọi video" },
      ];
  
      // Love language options
      const loveLanguageOptions: { id: LOVE_LANGUAGE, label: string }[] = [
          { id: "NHUNG_CU_CHI_AU_YEM", label: "Những cử chỉ âu yếm" },
          { id: "NHUNG_HANH_DONG_TINH_TE", label: "Những hành động tinh tế" },
          { id: "NHUNG_LOI_KHEN", label: "Những lời khen" },
          { id: "NHUNG_MON_QUA", label: "Những món quà" },
          { id: "THOI_GIAN_BEN_NHAU", label: "Thời gian bên nhau" },
      ];
  
      // Education options
      const educationOptions: { id: EDUCATION, label: string }[] = [
          { id: "CU_NHAN", label: "Cử nhân" },
          { id: "DANG_HOC_DAI_HOC", label: "Đang học đại học" },
          { id: "SAU_DAI_HOC", label: "Sau đại học" },
          { id: "TIEN_SI", label: "Tiến sĩ" },
          { id: "THPT", label: "Trung học phổ thông" },
          { id: "THAC_SI", label: "Thạc sĩ" },
          { id: "TRUONG_DAY_NGHE", label: "Trường dạy nghề" },
      ];
  
      // Zodiac sign options
      const zodiacSignOptions: { id: ZODIAC_SIGN, label: string }[] = [
          { id: "BaoBinh", label: "Bảo Bình" },
          { id: "SongNgu", label: "Song Ngư" },
          { id: "BachDuong", label: "Bạch Dương" },
          { id: "KimNguu", label: "Kim Ngưu" },
          { id: "SongTu", label: "Song Tử" },
          { id: "CuGiai", label: "Cự Giải" },
          { id: "SuTu", label: "Sư Tử" },
          { id: "XuNu", label: "Xử Nữ" },
          { id: "ThienBinh", label: "Thiên Bình" },
          { id: "BoCap", label: "Bọ Cạp" },
          { id: "NhanMa", label: "Nhân Mã" },
          { id: "MaKet", label: "Ma Kết" },
      ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Về bạn</Text>
      
      {/* Zodiac */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Cung hoàng đạo</Text>
        {editMode 
          ? <Picker  
            value={zodiac}
            setValue={setZodiac}
            options={zodiacSignOptions}
          />
          : <Text style={styles.fieldValue}>{MappingZodiacSign[user?.zodiac as ZODIAC_SIGN]}</Text>
        }
      </View>
      
      {/* Education */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Trình độ học vấn</Text>
        {editMode 
          ? <Picker  
            value={education}
            setValue={setEducation}
            options={educationOptions}
          />
          : <Text style={styles.fieldValue}>{MappingEducation[user?.education as EDUCATION]}</Text>
        }
      </View>
      
      {/* Love Language */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Ngôn ngữ tình yêu</Text>
        {editMode 
          ? <Picker  
            value={loveLanguage}
            setValue={setLoveLanguage}
            options={loveLanguageOptions}
          />
          : <Text style={styles.fieldValue}>{MappingLoveLanguage[user?.loveLanguage as LOVE_LANGUAGE]}</Text>
        }
      </View>
      
      {/* Communication Style */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Phong cách giao tiếp</Text>
        {editMode 
          ? <Picker  
            value={communicationStyle}
            setValue={setCommunicationStyle}
            options={communicationStyleOptions}
          />
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
