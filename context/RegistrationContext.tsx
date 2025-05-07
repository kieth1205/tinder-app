import { ALCOHOL_CONSUMPTION, COMMUNICATION_STYLE, DIETARY_PREFERENCE, EDUCATION, EXERCISE_FREQUENCY, GENDER, INTEREST, LOOKING_FOR, LOVE_LANGUAGE, PETS, SLEEP_PATTERN, SMOKING_PREFERENCE, SOCIAL_MEDIA_USAGE, ZODIAC_SIGN } from '@/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our registration data
interface RegistrationData {
  email: string; // OK
  name: string; // OK
  birthday: string; // OK
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
  pet?: PETS; // OK
  alcoholConsumption?: ALCOHOL_CONSUMPTION; // OK
  smoking?: SMOKING_PREFERENCE; // OK
  exerciseHabit?: EXERCISE_FREQUENCY; // OK
  // Phong cách sống

  diet?: DIETARY_PREFERENCE; // OK
  socialMediaActivity?: SOCIAL_MEDIA_USAGE; // OK
  sleepHabit?: SLEEP_PATTERN; // OK

  // Preferences
  preferredDistance?: number; // OK Maximum distance for matches (in km)
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
  email: '',
  name: '',
  birthday: '',
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
