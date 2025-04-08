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
import { useRegistration } from "@/context/RegistrationContext";

const BirthStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const router = useRouter();

  // Initialize local state with context value or empty string
  const [date, setDate] = useState<string>(registrationData.birthDate || "");

  const isValidAge = () => {
    if (!date) return false;

    // Format từ BirthdayInput là 'YYYY/MM/DD'
    // Cần chuyển đổi thành định dạng hợp lệ cho Date
    // Kiểm tra định dạng ngày
    const dateRegex = /^(\d{4})\/?(\d{2})\/?(\d{2})$/;
    const match = date.match(dateRegex);

    if (!match) {
      return false;
    }

    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // Tháng trong JavaScript là 0-11
    const day = parseInt(match[3]);

    // Tạo đối tượng Date với các giá trị đã được phân tích
    const birthDate = new Date(year, month, day);
    const today = new Date();

    // Tính tuổi
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  // Handler for date changes
  const handleDateChange = (value: string) => {
    setDate(value);
    updateRegistrationData('birthDate', value);
  };

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
            <Text style={styles.title}>{`Ngày sinh của bạn là`}</Text>
            <BirthdayInput
              value={date}
              onChange={handleDateChange}
              invalid={date !== "" && !isValidAge()}
              errorText={
                date !== "" && !isValidAge()
                  ? "Bạn phải trên 18 tuổi để sử dụng Tinder"
                  : "Tuổi của bạn sẽ được công khai trên tài khoản của bạn"
              }
            />
          </View>
        </ScrollView>
        <Button
          style={[styles.button, (!date || !isValidAge()) && styles.buttonDisabled]}
          onPress={() => router.push("/register/GenderStep")}
          disabled={!date || !isValidAge()}
          title="Tiếp tục"
        />
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
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
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
