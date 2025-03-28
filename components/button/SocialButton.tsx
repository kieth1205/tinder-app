import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

interface SocialButtonProps {
  icon?: string;
  title: string;
  onPress: () => void;
}

export const SocialButton = ({ icon, title, onPress }: SocialButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {/* {icon && <Image source={getIconSource(icon)} style={styles.icon} />} */}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const getIconSource = (icon: string) => {
  switch (icon) {
    // case "google":
    //   return require("../../assets/icons/google.png");
    // case "facebook":
    //   return require("../../assets/icons/facebook.png");
    // case "apple":
    //   return require("../../assets/icons/apple.png");
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
