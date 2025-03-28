import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SocialButton } from "@/components/button/SocialButton";

export default function Welcome() {
  return (
    <LinearGradient
      colors={["#EE805F", "#EA4080"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 24 }}
    >
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/tinder-logo-with-name.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.terms}>
            Bằng cách nhấn vào Tạo tài khoản hoặc Đăng nhập, bạn đồng ý với Điều
            khoản của chúng tôi. Tìm hiểu cách chúng tôi xử lý dữ liệu của bạn
            trong&nbsp;
            <Link href="/modal" asChild>
              <Text style={styles.link} children="Chính sách quyền riêng tư" />
            </Link>
            &nbsp;và&nbsp;
            <Link href="/modal" asChild>
              <Text
                style={styles.link}
                children="Chính sách cookie của chúng tôi."
              />
            </Link>
          </Text>

          <View style={styles.buttonContainer}>
            <SocialButton
              title="Tạo tài khoản"
              onPress={() => router.push("/register/PhoneStep")}
            />
            <SocialButton
              title="Đăng nhập"
              onPress={() => router.push("/login")}
            />
          </View>

          <Link href="/modal" asChild>
            <Text style={styles.troubleText}>Gặp sự cố khi đăng nhập?</Text>
          </Link>
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
  logo: {
    width: 190,
    height: 45,
  },
  link: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    textDecorationLine: "underline",
  },
});
