import React, { ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Themed";

interface AuthHeaderProps {
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
  leftIcon?: "arrow-back" | "close";
  rightComponent?: ReactNode;
  title?: string;
}

export const AuthHeader = ({
  onBack,
  style,
  leftIcon = "arrow-back",
  rightComponent,
  title,
}: AuthHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleBack}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name={leftIcon} size={28} color="gray" />
      </TouchableOpacity>
      {title && <Text style={styles.title}>{title}</Text>}
      {rightComponent && rightComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -20,
    marginBottom: 5,
  },
});
