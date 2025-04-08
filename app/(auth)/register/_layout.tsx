import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="PhoneStep" />
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
