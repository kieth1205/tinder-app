import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useState, useMemo } from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import TinderCard from "react-tinder-card";
import { TinderCard as TinderCardCustom } from "@/components/features";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have @expo/vector-icons installed

type Direction = "left" | "right" | "up";

const db = [
  {
    name: "Richard Hendricks",
    img: require("../../assets/images/icon.png"),
  },
  {
    name: "Erlich Bachman",
    img: require("../../assets/images/icon.png"),
  },
  {
    name: "Monica Hall",
    img: require("../../assets/images/icon.png"),
  },
  {
    name: "Jared Dunn",
    img: require("../../assets/images/icon.png"),
  },
  {
    name: "Dinesh Chugtai",
    img: require("../../assets/images/icon.png"),
  },
];

const alreadyRemoved: any = [];
let charactersState = db;

export default function TabOneScreen() {
  const [characters, setCharacters] = useState<any>(db);
  const [lastDirection, setLastDirection] = useState<string>();
  const [highlightedButton, setHighlightedButton] = useState<Direction | null>(
    null
  );

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const swiped = (direction: Direction, nameToDelete: string) => {
    console.log("removing: " + nameToDelete + " to the " + direction);
    setLastDirection(direction);
    alreadyRemoved.push(nameToDelete);
    setHighlightedButton(direction); // Highlight button based on swipe direction
  };

  const outOfFrame = (name: string) => {
    console.log(name + " left the screen!");
    charactersState = charactersState.filter(
      (character) => character.name !== name
    );
    setCharacters(charactersState);
    setHighlightedButton(null);
  };

  const swipe = (dir: Direction) => {
    const cardsLeft = characters.filter(
      (person: any) => !alreadyRemoved.includes(person.name)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name;
      const index = db.map((person) => person.name).indexOf(toBeRemoved);
      alreadyRemoved.push(toBeRemoved);
      (childRefs[index].current as any).swipe(dir);
    }
  };

  const onSwipeWillStart = (dir: Direction) => {
    setHighlightedButton(dir); // Highlight button while swiping
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {characters.map((character: any, index: number) => (
          <TinderCard
            ref={childRefs[index] as any}
            key={character.name}
            onSwipe={(dir) => swiped(dir as Direction, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
            onSwipeRequirementFulfilled={(dir) => {
              onSwipeWillStart(dir as Direction);
              console.log("Swipe requirement fulfilled for " + dir);
            }}
            onSwipeRequirementUnfulfilled={() => setHighlightedButton(null)} // Reset if swipe is canceled
          >
            <TinderCardCustom character={character} />
          </TinderCard>
        ))}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.dislikeButton,
            highlightedButton === "left" && styles.activeIcon, // Highlight if swiping left
            highlightedButton === "right" && { opacity: 0 }, // Hide when swiping right
            highlightedButton === "up" && { opacity: 0 }, // Hide when swiping up
          ]}
          onPress={() => swipe("left")}
        >
          <Ionicons name="close" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.superLikeButton,
            highlightedButton === "up" && styles.activeIcon, // Highlight if swiping up
            highlightedButton === "right" && { opacity: 0 }, // Hide when swiping right
            highlightedButton === "left" && { opacity: 0 }, // Hide when swiping left
          ]}
          onPress={() => swipe("up")}
        >
          <Ionicons name="star" size={36} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.likeButton,
            highlightedButton === "right" && styles.activeIcon, // Highlight if swiping right
            highlightedButton === "left" && { opacity: 0 }, // Hide when swiping left
            highlightedButton === "up" && { opacity: 0 }, // Hide when swiping up
          ]}
          onPress={() => swipe("right")}
        >
          <Ionicons name="heart" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  header: {
    color: "#000",
    fontSize: 30,
    marginBottom: 30,
  },
  cardContainer: {
    width: "100%",
    height: 550,
  },
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
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 20,
    backgroundColor: "transparent",
  },
  iconButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  dislikeButton: {
    backgroundColor: "#FF6B6B",
  },
  likeButton: {
    backgroundColor: "#2ECC71",
  },
  superLikeButton: {
    backgroundColor: "#3498DB",
  },
  infoText: {
    height: 28,
    justifyContent: "center",
    display: "flex",
    marginTop: 10,
  },
  activeIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
