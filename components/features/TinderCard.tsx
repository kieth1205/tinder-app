import React from "react";
import { View } from "../Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { IStory, Story } from "./Story";
import { UserSuggestion } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface TinderCardProps {
  character: UserSuggestion;
}

export const TinderCard = ({ character }: TinderCardProps) => {
  const router = useRouter();

  const handleInfoPress = () => {
    // Chuyển hướng tới màn hình chi tiết người dùng với ID
    router.push({
      pathname: "/user-detail/[id]",
      params: { id: character.id }
    });
  };

  return (
    <View style={styles.card}>
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
      <TouchableOpacity 
        style={styles.infoButton} 
        onPress={handleInfoPress}
      >
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
});
