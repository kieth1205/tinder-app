import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import React from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TextInput } from "@/components/inputs";

const PhoneStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  const isValidVietnamesePhoneNumber = (phone: string) => {
    // Vietnamese phone number format: 
    // Start with 0, followed by 9 digits
    // Or start with +84, followed by 9 digits
    return /^(0|\+84)[0-9]{9}$/.test(phone.replace(/\s/g, ''));
  };

  const handleNext = () => {
    const phone = registrationData.phoneNumber?.trim() || '';

    if (!phone) {
      Alert.alert("Lỗi", "Vui lòng nhập số điện thoại");
      return;
    }

    if (!isValidVietnamesePhoneNumber(phone)) {
      Alert.alert(
        "Lỗi",
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc +84912345678)"
      );
      return;
    }

    router.push("/register/PhotosStep");
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, spaces, and + character
    const sanitizedValue = value.replace(/[^0-9\s+]/g, '');
    updateRegistrationData('phoneNumber', sanitizedValue)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          marginTop: Platform.OS === "ios" ? 40 : 20,
          marginBottom: 20,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="gray" />
      </TouchableOpacity>
      <Text style={styles.title}>Số điện thoại của bạn là</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        outlineMode="bottom"
        value={registrationData.phoneNumber}
        onChangeText={handlePhoneChange}
      />
      <Button title="Tiếp tục" onPress={handleNext} />
    </View>
  );
};

export default PhoneStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 38.29,
    fontWeight: "600",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#828693",
    textAlign: "left",
    marginBottom: 117,
    marginTop: 44,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    color: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
