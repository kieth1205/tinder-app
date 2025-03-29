import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean; // Thêm prop gradient
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled,
  loading,
  style,
  textStyle,
  gradient, // Nhận prop gradient
}: ButtonProps) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  const content = loading ? (
    <ActivityIndicator
      color={variant === "outline" ? "#FE3C72" : "white"}
      size="small"
    />
  ) : (
    <Text style={textStyles}>{title}</Text>
  );

  return (
    <TouchableOpacity
      style={!gradient && buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {gradient ? (
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#EA4080", "#EE805F"]} // Thay đổi màu sắc gradient theo ý muốn
          style={styles.gradientButton}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  gradientButton: {
    borderRadius: 50,
    paddingVertical: 12, // Thay đổi padding nếu cần
    paddingHorizontal: 24,
  },
  button_primary: {
    backgroundColor: "#FE3C72",
  },
  button_secondary: {
    backgroundColor: "#424242",
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FE3C72",
  },
  button_disabled: {
    backgroundColor: "#E8E6EA",
  },
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  text_primary: {
    color: "white",
  },
  text_secondary: {
    color: "white",
  },
  text_outline: {
    color: "#FE3C72",
  },
  text_disabled: {
    color: "#9B9B9B",
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});
