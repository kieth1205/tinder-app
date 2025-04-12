import { Stack } from "expo-router";

export const STEPS = {
  "EmailStep": 0,
  "NameStep": 1,
  "BirthStep": 2,
  "GenderStep": 3,
  "DistanceStep": 4,
  "LookingForStep": 5,
  "StyleStep": 6,
  "AboutYouStep": 7,
  "InterestStep": 8,
  "PhotosStep": 9,
  "ProfilePassStep": 10,
  "SuccessStep": 11,
}
export const TOTAL_STEPS = Object.values(STEPS).length;


export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="EmailStep" />
      <Stack.Screen name="LookingForStep" />
      <Stack.Screen name="StyleStep" />
      <Stack.Screen name="AboutYouStep" />
      <Stack.Screen name="DistanceStep" />
      {/* <Stack.Screen name="OTPStep" /> */}
      <Stack.Screen name="NameStep" />
      <Stack.Screen name="BirthStep" />
      <Stack.Screen name="GenderStep" />
      <Stack.Screen name="ProfilePassStep" />
      <Stack.Screen name="InterestStep" />
      <Stack.Screen name="PhotosStep" />
      <Stack.Screen name="SuccessStep" />
    </Stack>
  );
}
