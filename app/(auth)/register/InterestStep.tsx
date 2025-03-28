import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "@/components/progress-bar/ProgressBar";
import { AuthHeader } from "@/components/AuthHeader";
import { router } from "expo-router";

const interests = [
  { id: "1", name: "Âm nhạc", icon: "music" },
  { id: "2", name: "Du lịch", icon: "airplane" },
  { id: "3", name: "Thể thao", icon: "soccer" },
  { id: "4", name: "Nghệ thuật", icon: "palette" },
  { id: "5", name: "Ẩm thực", icon: "food" },
  { id: "6", name: "Công nghệ", icon: "laptop" },
];

const InterestStep = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
        <Text style={styles.title}>Interest</Text>
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
              selected.includes(item.id) && styles.selectedCard,
            ]}
            onPress={() => toggleInterest(item.id)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color={selected.includes(item.id) ? "#FF5864" : "#666"}
            />
            <Text style={styles.interestText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
});

export default InterestStep;
