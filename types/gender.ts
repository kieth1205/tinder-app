export type Gender = "MALE" | "FEMALE" | "BOTH";

export const MappingGenderPreference: Record<Gender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  BOTH: "Cả hai"
};

export const GenderPreferenceOptions = Object.entries(MappingGenderPreference).map(([key, value]) => ({
    id: key,
    label: value,
}));
    