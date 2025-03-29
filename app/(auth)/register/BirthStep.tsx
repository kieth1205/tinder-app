import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthHeader } from "@/components/AuthHeader";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { Button } from "@/components/button/ContinueButton";
import BirthdayInput from "@/components/inputs/BirthdayInput";

const BirthStep = () => {
  const [date, setDate] = useState<string>("");
  const router = useRouter();

  const isValidAge = () => {
    const today = new Date();
    const age = today.getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  };

  console.log(date, isValidAge());

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={2} totalSteps={5} />
      <AuthHeader onBack={() => router.back()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>{`My\nbirthday is`}</Text>

            <BirthdayInput
              value={date}
              onChange={setDate}
              invalid={!isValidAge()}
              errorText="You must be at least 18 years old to use Tinder"
            />
            <Button
              style={[styles.button, !date && styles.buttonDisabled]}
              onPress={() => router.push("/register/GenderStep")}
              disabled={!date}
              title="CONTINUE"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BirthStep;

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
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 32,
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
