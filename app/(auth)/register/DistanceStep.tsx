import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { useRegistration } from "@/context/RegistrationContext";
import Slider from "@react-native-community/slider";
import { STEPS, TOTAL_STEPS } from "./_layout";

const DistanceStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  // Initialize with default value or existing value from context
  const [distance, setDistance] = useState<number>(
    registrationData.preferredDistance || 50
  );

  const handleDistanceChange = (value: number) => {
    // Round to whole number
    const roundedValue = Math.round(value);
    setDistance(roundedValue);
  };

  const handleNext = () => {
    // Save the distance value to context
    updateRegistrationData('preferredDistance', distance);

    // Navigate to the next step - adjust this based on your flow
    router.push("/register/LookingForStep");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={STEPS.DistanceStep} totalSteps={TOTAL_STEPS} />
      <AuthHeader onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Khoảng cách tìm kiếm</Text>
          <Text style={styles.subtitle}>
            Bạn muốn tìm kiếm người ở khoảng cách bao xa?
          </Text>

          <View style={styles.distanceContainer}>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                value={distance}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor="#FF4458"
                maximumTrackTintColor="#e0e0e0"
                thumbTintColor="#FF4458"
              />
              <View style={styles.valueContainer}>
                <Text style={styles.minValue}>1 km</Text>
                <Text style={styles.currentValue}>{distance} km</Text>
                <Text style={styles.maxValue}>100 km</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>
                Chỉ hiển thị những người nằm trong phạm vi {distance} km từ vị trí của bạn.
              </Text>
            </View>
          </View>

          <Button
            style={styles.button}
            title="Tiếp tục"
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DistanceStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
  distanceContainer: {
    marginBottom: 30,
  },
  sliderContainer: {
    marginVertical: 20,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 5,
  },
  minValue: {
    fontSize: 12,
    color: "#666",
  },
  currentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4458",
  },
  maxValue: {
    fontSize: 12,
    color: "#666",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
  button: {
    marginTop: 30,
  }
});
