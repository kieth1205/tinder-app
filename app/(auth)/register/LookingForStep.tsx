import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, FontAwesome, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { useRegistration } from "@/context/RegistrationContext";
import { LOOKING_FOR } from "@/types";
import { STEPS, TOTAL_STEPS } from "./_layout";

const LookingForStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();
  const [selectedOption, setSelectedOption] = useState<LOOKING_FOR | null>(
    registrationData.lookingFor || null
  );

  const lookingForOptions = [
    {
      id: "NGUOI_YEU",
      label: "Người yêu",
      icon: "heart",
      iconType: "font-awesome"
    },
    {
      id: "HEN_HO_LAU_DAI",
      label: "Bạn hẹn hò\nlâu dài",
      icon: "grin-hearts",
      iconType: "font-awesome-5"
    },
    {
      id: "BAT_KI_DIEU_GI_CO_THE",
      label: "Bất kì điều gì\ncó thể",
      icon: "glass-cheers",
      iconType: "font-awesome-5"
    },
    {
      id: "QUAN_HE_KHONG_RANG_BUOC",
      label: "Quan hệ\nkhông ràng buộc",
      icon: "party-popper",
      iconType: "material-community"
    },
    {
      id: "NHUNG_NGUOI_BAN_MOI",
      label: "Những người\nbạn mới",
      icon: "wave",
      iconType: "material-community"
    },
    {
      id: "CHUA_RO",
      label: "Mình cũng\nchưa rõ lắm",
      icon: "thinking",
      iconType: "material-community"
    },
  ];

  const handleNext = () => {
    if (selectedOption) {
      updateRegistrationData('lookingFor', selectedOption);
      router.push("/register/StyleStep");
    }
  };

  const renderIcon = (option: any) => {
    switch (option.iconType) {
      case "font-awesome":
        return (
          <FontAwesome
            name={option.icon}
            size={30}
            color="#fff"
          />
        );
      case "font-awesome-5":
        return (
          <FontAwesome5
            name={option.icon}
            size={30}
            color="#fff"
          />
        );
      case "material-community":
        return (
          <MaterialCommunityIcons
            name={option.icon}
            size={30}
            color="#fff"
          />
        );
      default:
        return (
          <Ionicons
            name={option.icon as any}
            size={30}
            color="#fff"
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={STEPS.LookingForStep} totalSteps={TOTAL_STEPS} />
      <AuthHeader onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Bạn đang tìm kiếm điều gì?</Text>
          <Text style={styles.subtitle}>Nếu bạn thay đổi suy nghĩ thì cũng không sao. Sẽ luôn có ai đó phù hợp với mục đích của bạn.</Text>

          <View style={styles.optionsGrid}>
            {lookingForOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.selectedCard,
                ]}
                onPress={() => setSelectedOption(option.id as LOOKING_FOR)}
              >
                <View style={styles.iconContainer}>
                  {renderIcon(option)}
                </View>
                <Text
                  style={styles.optionText}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            style={[styles.button, !selectedOption && styles.buttonDisabled]}
            title="Tiếp tục"
            onPress={handleNext}
            disabled={!selectedOption}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LookingForStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  optionCard: {
    width: "30%",
    aspectRatio: 0.9,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedCard: {
    borderWidth: 1,
    borderColor: "#FF4458",
    backgroundColor: "#FFF0F0",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF4458",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
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
