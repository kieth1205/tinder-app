import {  
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from "react-native";
import React from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TextInput } from "@/components/inputs";

const EmailStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  const isValidEmail = (email: string) => {
    // Simple email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleNext = () => {
    const email = registrationData.email?.trim() || '';

    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Địa chỉ email không hợp lệ. Vui lòng thử lại.");
      return;
    }

    router.push("/register/BirthStep");
  };

  const handleEmailChange = (value: string) => {
    updateRegistrationData("email", value);
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
      <Text style={styles.title}>Email của bạn là</Text>
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ email"
        outlineMode="bottom"
        value={registrationData.email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Tiếp tục" onPress={handleNext} />
    </View>
  );
};

export default EmailStep;

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
