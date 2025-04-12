import api from '@/services/api';
import { ALCOHOL_CONSUMPTION, COMMUNICATION_STYLE, DIETARY_PREFERENCE, EDUCATION, EXERCISE_FREQUENCY, FUTURE_FAMILY, GENDER, INTEREST, LOOKING_FOR, LOVE_LANGUAGE, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE, ZODIAC_SIGN } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';

// Define the shape of our registration data
interface RegistrationData {
  email: string; // OK
  name: string; // OK
  birthDate: string; // OK
  gender?: GENDER; // OK
  images: string[]; // OK
  shortVideo: string; // NOT OK
  password: string; // OK
  rawProfile: string; // OK

  // Enum
  interests?: INTEREST[]; // OK
  lookingFor?: LOOKING_FOR; // OK
  // language?: string; // NOT OK
  zodiacSign?: ZODIAC_SIGN; // OK
  education?: EDUCATION; // OK
  // futureFamily?: FUTURE_FAMILY; // NOT OK 
  communicationStyle?: COMMUNICATION_STYLE; // OK
  loveLanguage?: LOVE_LANGUAGE; // OK
  
  // Phong cách sống
  pets?: PETS; // OK
  alcoholConsumption?: ALCOHOL_CONSUMPTION; // OK
  smoking?: SMOKING_PREFERENCE; // OK
  exerciseHabit?: EXERCISE_FREQUENCY; // OK
  // Phong cách sống

  diet?: DIETARY_PREFERENCE; // NOT OK
  socialMediaActivity?: SOCIAL_MEDIA_USAGE; // NOT OK
  sleepHabit?: SLEEP_PATTERN; // NOT OK

  // Preferences
  preferredDistance?: number; // OK Maximum distance for matches (in km)
}

// Define the context shape with data and update functions
interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (field: keyof RegistrationData, value: any) => void;
  resetRegistrationData: () => void;
  handleRegister: () => Promise<any>;
}

// Create the context with default values
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Default/initial registration data
const initialRegistrationData: RegistrationData = {
  email: '',
  name: '',
  birthDate: '',
  images: [],
  shortVideo: '',
  password: '',
  rawProfile: '',
};

// Provider component
export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialRegistrationData);

  const updateRegistrationData = (field: keyof RegistrationData, value: any) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const resetRegistrationData = () => {
    setRegistrationData(initialRegistrationData);
  };

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/signup', registrationData);
      console.log("res", res.data)
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Đăng ký thất bại");
      throw err;
    }
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        resetRegistrationData,
        handleRegister
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Custom hook to use the registration context
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
