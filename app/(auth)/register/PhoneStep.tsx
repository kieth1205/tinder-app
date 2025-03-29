import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Button } from "@/components/button/ContinueButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TextInput } from "@/components/inputs";

const PhoneStep = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNext = () => {
    router.push("/register/OTPStep");
    console.log("Phone number:", phoneNumber);
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
      <Text style={styles.title}>My number is</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        outlineMode="bottom"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Text style={styles.description}>
        We will send a text with a verification code. Message and data rates may
        apply. &nbsp;
        <Text style={{ textDecorationLine: "underline" }}>
          Learn what happens when your number changes.
        </Text>
      </Text>

      <Button title="CONTINUE" gradient onPress={handleNext} />
    </View>
  );
};

export default PhoneStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
