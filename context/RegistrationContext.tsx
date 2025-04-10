import { ALCOHOL_CONSUMPTION, COMMUNICATION_STYLE, DIETARY_PREFERENCE, EDUCATION, EXERCISE_FREQUENCY, FUTURE_FAMILY, GENDER, INTEREST, LOOKING_FOR, LOVE_LANGUAGE, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE, ZODIAC_SIGN } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our registration data
interface RegistrationData {
  phoneNumber: string; // OK
  name: string; // OK
  birthDate: string; // OK
  gender?: GENDER; // OK
  images: string[]; // NOT OK
  shortVideo: string; // NOT OK
  password: string; // NOT OK
  rawProfile: string; // NOT OK

  // Enum
  interests?: INTEREST[]; // NOT OK
  lookingFor?: LOOKING_FOR; // NOT OK
  language?: string; // NOT OK
  zodiacSign?: ZODIAC_SIGN; // NOT OK
  education?: EDUCATION; // NOT OK
  futureFamily?: FUTURE_FAMILY; // NOT OK
  communicationStyle?: COMMUNICATION_STYLE; // NOT OK
  loveLanguage?: LOVE_LANGUAGE; // NOT OK
  pets?: PETS; // NOT OK
  alcoholConsumption?: ALCOHOL_CONSUMPTION; // NOT OK
  smoking?: SMOKING_PREFERENCE; // NOT OK
  exerciseHabit?: EXERCISE_FREQUENCY; // NOT OK
  diet?: DIETARY_PREFERENCE; // NOT OK
  socialMediaActivity?: SOCIAL_MEDIA_USAGE; // NOT OK
  sleepHabit?: SLEEP_PATTERN; // NOT OK
}

// Define the context shape with data and update functions
interface RegistrationContextType {
  registrationData: RegistrationData;
  updateRegistrationData: (field: keyof RegistrationData, value: any) => void;
  resetRegistrationData: () => void;
}

// Create the context with default values
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Default/initial registration data
const initialRegistrationData: RegistrationData = {
  phoneNumber: '',
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

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        resetRegistrationData,
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
