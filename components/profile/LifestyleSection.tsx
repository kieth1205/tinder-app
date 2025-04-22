import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '@/services/userService';
import { Picker } from '@react-native-picker/picker';
import { ALCOHOL_CONSUMPTION, DIETARY_PREFERENCE, EXERCISE_FREQUENCY, MappingAlcoholConsumption, MappingDietaryPreference, MappingExercise, MappingPets, MappingSleepPattern, MappingSmokingPreference, MappingSocialMediaUsage, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE } from '@/types';

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
  const petOptions = [
    { id: 'KHONG_THICH_THU_CUNG', label: 'Không thích thú cưng' },
    { id: 'CHO', label: 'Chó' },
    { id: 'MEO', label: 'Mèo' },
    { id: 'CA_HAI', label: 'Cả hai' },
    { id: 'THU_CUNG_KHAC', label: 'Thú cưng khác' }
  ];
  
  const alcoholOptions = [
    { id: 'KHONG_DANH_CHO_MINH', label: 'Không dành cho mình' },
    { id: 'KHONG_BAO_GIO', label: 'Không bao giờ' },
    { id: 'THINH_THOANG', label: 'Thỉnh thoảng' },
    { id: 'THUONG_XUYEN', label: 'Thường xuyên' }
  ];
  
  const smokingOptions = [
    { id: 'KHONG_BAO_GIO', label: 'Không bao giờ' },
    { id: 'THINH_THOANG', label: 'Thỉnh thoảng' },
    { id: 'THUONG_XUYEN', label: 'Thường xuyên' },
    { id: 'KHI_DI_CHOI', label: 'Khi đi chơi' }
  ];
  
  const exerciseOptions = [
    { id: 'MOI_NGAY', label: 'Mỗi ngày' },
    { id: 'THUONG_XUYEN', label: 'Thường xuyên' },
    { id: 'THINH_THOANG', label: 'Thỉnh thoảng' },
    { id: 'CHI_KHI_DI_CHOI', label: 'Chỉ khi đi chơi' }
  ];
  
  const dietOptions = [
    { id: 'AN_TAT_CA', label: 'Ăn tất cả' },
    { id: 'AN_CHAY', label: 'Ăn chay' },
    { id: 'AN_KIENG', label: 'Ăn kiêng' },
    { id: 'KHONG_AN_DO_BIEN', label: 'Không ăn đồ biển' }
  ];
  
  const socialMediaOptions = [
    { id: 'RAT_IT_KHI', label: 'Rất ít khi' },
    { id: 'THINH_THOANG', label: 'Thỉnh thoảng' },
    { id: 'THUONG_XUYEN', label: 'Thường xuyên' },
    { id: 'LIEN_TUC', label: 'Liên tục' }
  ];
  
  const sleepOptions = [
    { id: 'DI_NGU_SOM', label: 'Đi ngủ sớm' },
    { id: 'CA_DEM', label: 'Thức cả đêm' },
    { id: 'NGU_TRUA', label: 'Ngủ trưa' },
    { id: 'THUC_KHUYA', label: 'Thức khuya' }
  ];

  const renderPicker = (
    value: string, 
    setValue: (value: string) => void, 
    options: {id: string, label: string}[]
  ) => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => setValue(itemValue)}
        style={styles.picker}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.id}
            label={option.label}
            value={option.id}
          />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lối sống</Text>
      
      {/* Pet */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Thú cưng</Text>
        {editMode 
          ? renderPicker(pet, setPet, petOptions)
          : <Text style={styles.fieldValue}>{MappingPets[user?.pet as PETS]}</Text>
        }
      </View>
      
      {/* Alcohol */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Uống rượu</Text>
        {editMode 
          ? renderPicker(alcoholConsumption, setAlcoholConsumption, alcoholOptions)
          : <Text style={styles.fieldValue}>{MappingAlcoholConsumption[user?.alcoholConsumption as ALCOHOL_CONSUMPTION]}</Text>
        }
      </View>
      
      {/* Smoking */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Hút thuốc</Text>
        {editMode 
          ? renderPicker(smoking, setSmoking, smokingOptions)
          : <Text style={styles.fieldValue}>{MappingSmokingPreference[user?.smoking as SMOKING_PREFERENCE]}</Text>
        }
      </View>
      
      {/* Exercise */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tập thể dục</Text>
        {editMode 
          ? renderPicker(exerciseHabit, setExerciseHabit, exerciseOptions)
          : <Text style={styles.fieldValue}>{MappingExercise[user?.exerciseHabit as EXERCISE_FREQUENCY]}</Text>
        }
      </View>
      
      {/* Diet */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Chế độ ăn</Text>
        {editMode 
          ? renderPicker(diet, setDiet, dietOptions)
          : <Text style={styles.fieldValue}>{MappingDietaryPreference[user?.diet as DIETARY_PREFERENCE]}</Text>
        }
      </View>
      
      {/* Social Media */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Mạng xã hội</Text>
        {editMode 
          ? renderPicker(socialMediaActivity, setSocialMediaActivity, socialMediaOptions)
          : <Text style={styles.fieldValue}>{MappingSocialMediaUsage[user?.socialMediaActivity as SOCIAL_MEDIA_USAGE]}</Text>
        }
      </View>
      
      {/* Sleep */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Thói quen ngủ</Text>
        {editMode 
          ? renderPicker(sleepHabit, setSleepHabit, sleepOptions)
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
  }
});
