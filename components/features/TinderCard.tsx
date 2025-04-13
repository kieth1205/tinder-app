import React from "react";
import { View } from "../Themed";
import { StyleSheet } from "react-native";
import { IStory, Story } from "./Story";

interface TinderCardProps {
  character: {
    name: string;
    images: string[];
  };
}

export const TinderCard = ({ character }: TinderCardProps) => {
  return (
    <View style={styles.card}>
      <Story name={character.name} stories={character.images.map((image) => ({
        id: image,
        uri: image,
        title: character.name,
        type: "image",
      })) as IStory[]} />
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
});
