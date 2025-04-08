import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import React from "react";
import { useRegistration } from "@/context/RegistrationContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";

const interests = [
  { id: "1", name: "Âm nhạc", icon: "music" },
  { id: "2", name: "Du lịch", icon: "airplane" },
  { id: "3", name: "Thể thao", icon: "soccer" },
  { id: "4", name: "Nghệ thuật", icon: "palette" },
  { id: "5", name: "Ẩm thực", icon: "food" },
  { id: "6", name: "Công nghệ", icon: "laptop" },
];

const InterestStep = () => {
  const { registrationData, updateRegistrationData } = useRegistration();

  const toggleInterest = (id: string) => {
    const updatedInterests = registrationData.interests.includes(id)
      ? registrationData.interests.filter((i) => i !== id)
      : [...registrationData.interests, id];

    updateRegistrationData('interests', updatedInterests);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={4} totalSteps={6} />
      <AuthHeader
        onBack={() => router.back()}
        rightComponent={
          <Pressable onPress={() => router.push("/register/PhotosStep")}>
            <Text children="Skip" />
          </Pressable>
        }
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sở thích</Text>
        <Text style={styles.subtitle}>
          Chọn ít nhất 3 sở thích để hiển thị trên hồ sơ
        </Text>
      </View>

      {/* Interest grid */}
      <FlatList
        data={interests}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 40,
        }}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.interestCard,
              registrationData.interests.includes(item.id) && styles.selectedCard,
            ]}
            onPress={() => toggleInterest(item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={28}
              color={registrationData.interests.includes(item.id) ? "#FF5864" : "#666"}
            />
            <Text style={styles.interestText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, !registrationData.name && styles.buttonDisabled]}
          onPress={() => router.push("/register/PhotosStep")}
          disabled={!registrationData.name}
          title="Tiếp tục"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#eee",
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF5864",
    borderRadius: 2,
    position: "absolute",
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  interestCard: {
    width: "48%",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  selectedCard: {
    backgroundColor: "#fff",
    borderColor: "#FF5864",
  },
  interestText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
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
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
});

export default InterestStep;
