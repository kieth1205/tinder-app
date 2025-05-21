import React from "react";
import { View, Text } from "../Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { IStory, Story } from "./Story";
import { UserSuggestion } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type OverlayDirection = "left" | "right" | "up" | null;

interface TinderCardProps {
  character: UserSuggestion;
  overlayDirection?: OverlayDirection;
}

export const TinderCard = ({ character, overlayDirection = null }: TinderCardProps) => {
  const router = useRouter();

  const handleInfoPress = () => {
    // Chuyển hướng tới màn hình chi tiết người dùng với ID
    router.push({
      pathname: "/user-detail/[id]",
      params: { id: character.id }
    });
  };

  const renderOverlayLabel = () => {
    if (!overlayDirection) return null;

    let label = "";
    let borderColor = "#2ECC71";
    let rotation = "-20deg";
    switch (overlayDirection) {
      case "right":
        label = "LIKE";
        borderColor = "#2ECC71";
        rotation = "-20deg";
        break;
      case "left":
        label = "NOPE";
        borderColor = "#FF6B6B";
        rotation = "20deg";
        break;
      case "up":
        label = "SUPER LIKE";
        borderColor = "#3498DB";
        rotation = "0deg";
        break;
    }

    return (
      <View
        style={[
          styles.overlayLabel,
          {
            borderColor,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Text style={[styles.overlayText, { color: borderColor }]}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      {renderOverlayLabel()}
      <Story
        user={character}
        name={character.name}
        stories={character.images.map((image) => ({
          id: image,
          uri: image,
          title: character.name,
          type: "image",
        })) as IStory[]}
      />
      <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
        <Ionicons name="arrow-up-circle" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
    height: 500,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: "cover",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  cardTitle: {
    position: "absolute",
    bottom: 0,
    margin: 10,
    color: "#fff",
  },
  infoButton: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 30,
    padding: 5,
    zIndex: 100,
  },
  overlayLabel: {
    position: "absolute",
    top: 40,
    left: 20,
    borderWidth: 4,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    zIndex: 200,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
