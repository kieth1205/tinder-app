import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '@/services/userService';
import { ALCOHOL_CONSUMPTION, DIETARY_PREFERENCE, EXERCISE_FREQUENCY, MappingAlcoholConsumption, MappingDietaryPreference, MappingExercise, MappingPets, MappingSleepPattern, MappingSmokingPreference, MappingSocialMediaUsage, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE } from '@/types';
import { Picker } from '../inputs';

interface LifestyleSectionProps {
  user: User;
  editMode: boolean;
  pet: string;
  setPet: (value: string) => void;
  alcoholConsumption: string;
  setAlcoholConsumption: (value: string) => void;
  smoking: string;
  setSmoking: (value: string) => void;
  exerciseHabit: string;
  setExerciseHabit: (value: string) => void;
  diet: string;
  setDiet: (value: string) => void;
  socialMediaActivity: string;
  setSocialMediaActivity: (value: string) => void;
  sleepHabit: string;
  setSleepHabit: (value: string) => void;
}

export default function LifestyleSection({
  user,
  editMode,
  pet,
  setPet,
  alcoholConsumption,
  setAlcoholConsumption,
  smoking,
  setSmoking,
  exerciseHabit,
  setExerciseHabit,
  diet,
  setDiet,
  socialMediaActivity,
  setSocialMediaActivity,
  sleepHabit,
  setSleepHabit
}: LifestyleSectionProps) {
  // Options for lifestyle preferences
  // Alcohol consumption options
      const alcoholOptions: { id: ALCOHOL_CONSUMPTION, label: string }[] = [
          { id: "KHONG_DANH_CHO_MINH", label: "Không dành cho mình" },
          { id: "LUON_TINH_TAO", label: "Luôn tỉnh táo" },
          { id: "UONG_CO_TRACH_NGHIEM", label: "Uống có trách nhiệm" },
          { id: "CHI_NHUNG_DIP_DAC_BIET", label: "Chỉ những dịp đặc biệt" },
          { id: "UONG_GIAO_LUU_VAO_CUOI_TUAN", label: "Uống giao lưu vào cuối tuần" },
          { id: "HAU_NHU_MOI_TOI", label: "Hầu như mỗi tối" },
      ];
  
      // Smoking preference options
      const smokingOptions: { id: SMOKING_PREFERENCE, label: string }[] = [
          { id: "HUT_THUOC_VOI_BAN_BE", label: "Hút thuốc với bạn bè" },
          { id: "HUT_THUOC_KHI_NHAU", label: "Hút thuốc khi nhậu" },
          { id: "KHONG_HUT_THUOC", label: "Không hút thuốc" },
          { id: "HUT_THUOC_THUONG_XUYEN", label: "Hút thuốc thường xuyên" },
          { id: "DANG_CO_GANG_BO", label: "Đang cố gắng bỏ" },
      ];
  
      const exerciseHabitOptions: { id: EXERCISE_FREQUENCY, label: string }[] = [
          { id: "HANG_NGAY", label: "Hàng ngày" },
          { id: "THUONG_XUYEN", label: "Hàng tuần" },
          { id: "THINH_THOANG", label: "Hàng tháng" },
          { id: "KHONG_TAP", label: "Không tập" },
      ];
  
      // Pet options
      const petOptions: { id: PETS, label: string }[] = [
          { id: "CHO", label: "Chó" },
          { id: "MEO", label: "Mèo" },
          { id: "BO_SAT", label: "Bò sát" },
          { id: "DONG_VAT_LUONG_CU", label: "Động vật lưỡng cư" },
          { id: "LOAI_CHIM", label: "Loài chim" },
          { id: "CA", label: "Cá" },
          { id: "RUA", label: "Rùa" },
          { id: "HAMSTER", label: "Hamster" },
          { id: "THO", label: "Thỏ" },
          { id: "KHAC", label: "Khác" },
          { id: "KHONG_NUOI_THU_CUNG", label: "Không nuôi thú cưng" },
          { id: "MUON_NUOI_THU_CUNG", label: "Muốn nuôi thú cưng" },
          { id: "DI_UNG_VOI_DONG_VAT", label: "Dị ứng với động vật" },
      ]
  
      // Dietary preference options
      const dietaryOptions: { id: DIETARY_PREFERENCE, label: string }[] = [
          { id: "CHI_AN_THIT", label: "Chỉ ăn thịt" },
          { id: "AN_CHAY", label: "Ăn chay" },
          { id: "AN_THUAN_CHAY", label: "Ăn thuần chay (Vegan)" },
          { id: "CHI_AN_HAI_SAN_RAU_CU", label: "Chỉ ăn hải sản và rau củ (Pescatarian)" }, 
          { id: "KHONG_AN_KIENG", label: "Không ăn kiêng" },
          { id: "KHAC", label: "Khác" },
      ];
  
      // Social media usage options
      const socialMediaOptions: { id: SOCIAL_MEDIA_USAGE, label: string }[] = [
          { id: "INFLUENCER", label: "Tôi là influencer" },
          { id: "HOAT_DONG_TICH_CUC", label: "Hoạt động tích cực" },
          { id: "LUOT_DAO_AM_THAM", label: "Lướt đảo âm thầm" },
          { id: "KHONG_DUNG_MANG", label: "Không dùng mạng xã hội" },
      ];
  
      // Sleep pattern options
      const sleepPatternOptions: { id: SLEEP_PATTERN, label: string }[] = [
          { id: "DAY_SOM", label: "Dậy sớm" },
          { id: "CU_DEM", label: "Cú đêm" },
          { id: "GIO_GIAC_LINH_HOAT", label: "Giờ giấc linh hoạt" },
      ];

  const renderPicker = (
    value: string, 
    setValue: (value: string) => void, 
    options: {id: string, label: string}[]
  ) => (
    <View style={styles.pickerContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.pickerButton,
            value === option.id && styles.pickerButtonSelected,
          ]}
          onPress={() => setValue(option.id)}
        >
          <Text
            style={[
              styles.pickerButtonText,
              value === option.id && styles.pickerButtonTextSelected,
            ]}
          >{option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lối sống</Text>
      
      {/* Pet */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Thú cưng</Text>
        {editMode 
          ? <Picker  
            value={pet}
            setValue={setPet}
            options={petOptions}
          />
          : <Text style={styles.fieldValue}>{MappingPets[user?.pet as PETS]}</Text>
        }
      </View>
      
      {/* Alcohol */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Uống rượu</Text>
        {editMode 
          ? <Picker  
            value={alcoholConsumption}
            setValue={setAlcoholConsumption}
            options={alcoholOptions}
          />
          : <Text style={styles.fieldValue}>{MappingAlcoholConsumption[user?.alcoholConsumption as ALCOHOL_CONSUMPTION]}</Text>
        }
      </View>
      
      {/* Smoking */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Hút thuốc</Text>
        {editMode 
          ? <Picker  
            value={smoking}
            setValue={setSmoking}
            options={smokingOptions}
          />
          : <Text style={styles.fieldValue}>{MappingSmokingPreference[user?.smoking as SMOKING_PREFERENCE]}</Text>
        }
      </View>
      
      {/* Exercise */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tập thể dục</Text>
        {editMode 
          ? <Picker  
            value={exerciseHabit}
            setValue={setExerciseHabit}
            options={exerciseHabitOptions}
          />
          : <Text style={styles.fieldValue}>{MappingExercise[user?.exerciseHabit as EXERCISE_FREQUENCY]}</Text>
        }
      </View>
      
      {/* Diet */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Chế độ ăn</Text>
        {editMode 
          ? <Picker  
            value={diet}
            setValue={setDiet}
            options={dietaryOptions}
          />
          : <Text style={styles.fieldValue}>{MappingDietaryPreference[user?.diet as DIETARY_PREFERENCE]}</Text>
        }
      </View>
      
      {/* Social Media */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Mạng xã hội</Text>
        {editMode 
          ? <Picker  
            value={socialMediaActivity}
            setValue={setSocialMediaActivity}
            options={socialMediaOptions}
          />
          : <Text style={styles.fieldValue}>{MappingSocialMediaUsage[user?.socialMediaActivity as SOCIAL_MEDIA_USAGE]}</Text>
        }
      </View>
      
      {/* Sleep */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Thói quen ngủ</Text>
        {editMode 
          ? <Picker  
            value={sleepHabit}
            setValue={setSleepHabit}
            options={sleepPatternOptions}
          />
          : <Text style={styles.fieldValue}>{MappingSleepPattern[user?.sleepHabit as SLEEP_PATTERN]}</Text>
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
