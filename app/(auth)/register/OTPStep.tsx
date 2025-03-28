import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/button/ContinueButton";
import OTPInput from "@/components/inputs/OTPInput";
const OTPStep = () => {
  const handleNext = () => {
    router.push("/register/NameStep");
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
      <View style={styles.contentContainer}>
        <Text style={styles.title}>My code is</Text>
        <Text style={styles.description}>
          Please enter the code sent to your phone number
        </Text>
        <OTPInput length={6} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="CONTINUE" gradient onPress={handleNext} />
      </View>
    </View>
  );
};

export default OTPStep;

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
  contentContainer: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
  },
});
