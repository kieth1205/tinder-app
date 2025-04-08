import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our registration data
interface RegistrationData {
  phoneNumber: string;
  name: string;
  birthDate: string;
  gender: string;
  interests: string[];
  photos: string[];
  // Add other fields as needed

  password: string;
  rawProfile: string;
  // Enum
  lookingFor: string;
  language: string;
  zodiacSign: string;

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
  gender: '',
  interests: [],
  photos: [],

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
