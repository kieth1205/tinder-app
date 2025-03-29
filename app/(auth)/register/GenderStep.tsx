import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";

const GenderStep = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>("male");

  const genderOptions = [
    { id: "male", label: "Nam", icon: "male" },
    { id: "female", label: "Nữ", icon: "female" },
  ];

  const handleNext = () => {
    router.push("/register/InterestStep");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={3} totalSteps={6} />
      <AuthHeader onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.title}>I am a</Text>

        <View style={styles.optionsContainer}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.genderOption,
                selectedGender === option.id && styles.selectedOption,
              ]}
              onPress={() => setSelectedGender(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={selectedGender === option.id ? "#fff" : "#FF4458"}
              />
              <Text
                style={[
                  styles.optionText,
                  selectedGender === option.id && styles.selectedText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Button
        style={[styles.button, !selectedGender && styles.buttonDisabled]}
        title="CONTINUE"
        onPress={handleNext}
      />
    </SafeAreaView>
  );
};

export default GenderStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  optionsContainer: {
    gap: 16,
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FF4458",
    gap: 12,
  },
  selectedOption: {
    backgroundColor: "#FF4458",
  },
  optionText: {
    fontSize: 16,
    color: "#FF4458",
  },
  selectedText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: "#FE3C72",
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: "auto",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#E8E6EA",
  },
});
