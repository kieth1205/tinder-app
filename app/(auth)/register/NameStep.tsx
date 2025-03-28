import { AuthHeader } from "@/components/AuthHeader";
import { Button } from "@/components/button/ContinueButton";
import { TextInput } from "@/components/inputs";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const NameStep = () => {
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={1} totalSteps={6} />
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
            value={name}
            outlineMode="bottom"
            onChangeText={setName}
            placeholder="Nhập tên của bạn"
            // autoFocus
          />
          <Text style={styles.hint}>
            Đây là cách nó sẽ xuất hiện trong Tinder và bạn sẽ không thể thay
            đổi nó
          </Text>
        </ScrollView>
        <Button
          style={[styles.button, !name && styles.buttonDisabled]}
          onPress={() => router.push("/register/BirthStep")}
          disabled={!name}
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
    color: "gray",
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
