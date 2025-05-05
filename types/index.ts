export * from './options'

export type UserSuggestion = {
    id: string;
    name: string;
    images: string[];
    gender: string;
    similarityScore: number;
    interests: string[];
    additionalInfo?: {
      rawProfile?: string;
      lookingFor?: string;
      zodiac?: string;
      education?: string;
      loveLanguage?: string;
      pet?: string;
      alcoholConsumption?: string;
      smoking?: string;
      exerciseHabit?: string;
      diet?: string;
      socialMediaActivity?: string;
      sleepHabit?: string;
      communicationStyle?: string;
      distance?: string;
    };
};