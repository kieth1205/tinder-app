import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TextInput } from "@/components/inputs";

const PhoneStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  const handleNext = () => {
    router.push("/register/NameStep");
  };

  const handlePhoneChange = (value: string) => {
    updateRegistrationData('phoneNumber', value);
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
