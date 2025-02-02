import React from "react";
import { View } from "../Themed";
import { StyleSheet } from "react-native";
import { Story } from "./Story";

interface TinderCardProps {
  character: {
    name: string;
    img: any;
  };
}

export const TinderCard = ({ character }: TinderCardProps) => {
  return (
    <View style={styles.card}>
      <Story name={character.name} />
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
