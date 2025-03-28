import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SocialButton } from "@/components/button/SocialButton";

export default function Welcome() {
  return (
    <LinearGradient
      colors={["#FE3C72", "#FF2D55"]}
      style={{ flex: 1, paddingHorizontal: 24 }}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>{/* Tinder Logo */}</View>

        <View style={styles.bottomSection}>
          <Text style={styles.terms}>
            By tapping Create Account or Sign In, you agree to our Terms. Learn
            how we process your data in our Privacy Policy and Cookies Policy.
          </Text>

          <View style={styles.buttonContainer}>
            <SocialButton
              title="SIGN UP"
              onPress={() => router.push("/register")}
            />
            <SocialButton
              title="SIGN IN"
              onPress={() => router.push("/login")}
            />
          </View>

          <Text style={styles.troubleText}>Trouble Signing In?</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    paddingBottom: 40,
  },
  terms: {
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 12,
  },
  buttonContainer: {
    gap: 12,
  },
  troubleText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});
