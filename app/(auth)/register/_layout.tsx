import { Stack } from "expo-router";

export const TOTAL_STEPS = 6;
export const STEPS = {
  "PhoneStep": 1,
  "StyleStep": 7,
  "NameStep": 2,
  "BirthStep": 3,
  "GenderStep": 4,
  "InterestStep": 5,
  "PhotosStep": 6,
  "SuccessStep": 8,
}


export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PhoneStep" />
      <Stack.Screen name="StyleStep" />
      {/* <Stack.Screen name="OTPStep" /> */}
      <Stack.Screen name="NameStep" />
      <Stack.Screen name="BirthStep" />
      <Stack.Screen name="GenderStep" />
      <Stack.Screen name="InterestStep" />
      <Stack.Screen name="PhotosStep" />
      <Stack.Screen name="SuccessStep" />
    </Stack>
  );
}
