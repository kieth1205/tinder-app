import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { router } from "expo-router";
import { Button } from "@/components/button/ContinueButton";

const PhotosStep = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleAddPhoto = async () => {
    // TODO: Implement photo picker logic
  };

  const handleNext = () => {
    router.push("/register/SuccessStep");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar step={5} totalSteps={6} />
      <AuthHeader onBack={() => router.back()} />
      <Text style={styles.title}>Add photos</Text>
      <Text style={styles.subtitle}>Add at least 2 photos to continue</Text>

      <ScrollView contentContainerStyle={styles.photoGrid}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.photoBox}
            onPress={handleAddPhoto}
          >
            {photos[index] ? (
              <Image source={{ uri: photos[index] }} style={styles.photo} />
            ) : (
              <View style={styles.addPhotoPlaceholder}>
                <Ionicons name="add" size={40} color="#FF4458" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Tiếp tục" gradient onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

export default PhotosStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 28,
  },
  photoBox: {
    width: "30%",
    aspectRatio: 0.75,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  addPhotoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: 8,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 28,
  },
});
