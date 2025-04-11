import { AuthHeader } from "@/components/AuthHeader";
import { Button } from "@/components/button/ContinueButton";
import { TextInput } from "@/components/inputs";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { router } from "expo-router";
import React from "react";
import { useRegistration } from "@/context/RegistrationContext";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { STEPS, TOTAL_STEPS } from "./_layout";

const NameStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  const handleNext = () => {
    if (!registrationData.name) {
      Alert.alert("Lỗi", "Vui lòng nhập tên");
      return;
    }
    router.push("/register/BirthStep");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={STEPS.NameStep} totalSteps={TOTAL_STEPS} />
      <AuthHeader leftIcon="close" onBack={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title} children="Tên của bạn là" />
          <TextInput
            style={styles.input}
            value={registrationData.name}
            outlineMode="bottom"
            onChangeText={(value) => updateRegistrationData('name', value)}
            placeholder="Nhập tên của bạn"
          // autoFocus
          />
          <Text style={styles.hint}>
            Đây là cách nó sẽ xuất hiện trong Tinder và bạn sẽ không thể thay
            đổi nó
          </Text>
        </ScrollView>
        <Button
          style={[styles.button, !registrationData.name && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!registrationData.name}
          title="Tiếp tục"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NameStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#E8E6EA",
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  hint: {
    color: "#8E8E8E",
    fontSize: 12,
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
