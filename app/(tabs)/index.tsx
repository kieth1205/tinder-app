import { SafeAreaView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useState, useMemo, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import TinderCard from "react-tinder-card";
import { TinderCard as TinderCardCustom } from "@/components/features";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have @expo/vector-icons installed
import { useGetMatches } from "@/hooks/use-get-matches";
import swipeService, { SwipeDirection } from "@/services/swipeService";
import useVipStatus from "@/hooks/useVipStatus";
import { useFocusEffect } from "expo-router";

// Map tinder-card directions to our API SwipeDirection enum
export type Direction = "left" | "right" | "up";
export const mapDirectionToSwipeDirection = (direction: Direction): SwipeDirection => {
  switch (direction) {
    case "left": return SwipeDirection.LEFT;
    case "right": return SwipeDirection.RIGHT;
    case "up": return SwipeDirection.UP;
    default: return SwipeDirection.LEFT;
  }
};

// Fallback data trong trường hợp API fails
const fallbackData = [
  {
    name: "Richard Hendricks",
    img: "https://firebasestorage.googleapis.com/v0/b/file-storage-6ac01.appspot.com/o/tinder%2Fimages%2F2025%2F04%2F13%2Fom-1.jpeg?alt=media&token=818bb487-d1a2-4f86-924f-6bf885c32a3d",
  },
  {
    name: "Erlich Bachman",
    img: "https://firebasestorage.googleapis.com/v0/b/file-storage-6ac01.appspot.com/o/tinder%2Fimages%2F2025%2F04%2F13%2Fom-2.png?alt=media&token=753a8b7b-8bef-4081-9834-07ba21b8e46b",
  },
];

const alreadyRemoved: string[] = [];

export default function TabOneScreen() {
  const { data: matchesData, isLoading, error, refetch } = useGetMatches();

  const [characters, setCharacters] = useState<any[]>([]);
  const [highlightedButton, setHighlightedButton] = useState<Direction | null>(null);
  const [swipeOverlayDirection, setSwipeOverlayDirection] = useState<Direction | null>(null);

  const { isVip, refreshVipStatus } = useVipStatus();
    
  useFocusEffect(
    React.useCallback(() => {
      refreshVipStatus();
      refetch();
    }, [refreshVipStatus, refetch])
  );

  useEffect(() => {
    if (matchesData && matchesData.length > 0) {
      setCharacters(matchesData);
    } else if (error) {
      console.error("Error fetching matches:", error);
      setCharacters(fallbackData);
    }
  }, [matchesData, error]);

  const childRefs = useMemo(() => {
    return Array(characters.length)
      .fill(0)
      .map(() => React.createRef());
  }, [characters.length]);

  const swiped = async (direction: Direction, nameToDelete: string) => {
    if (direction === "up" && !isVip) {
      Alert.alert(
        "Tính năng dành cho VIP",
        "Bạn cần nâng cấp tài khoản VIP để sử dụng tính năng Super Like.",
        [{ text: "Đã hiểu", style: "default" }]
      );
      return;
    }

    alreadyRemoved.push(nameToDelete);
    setHighlightedButton(direction); 
    setSwipeOverlayDirection(direction);
    setTimeout(() => setSwipeOverlayDirection(null), 800);

    const user = characters.find((character) => character.name === nameToDelete);
    if (user && user.id) {
      try {
        const apiDirection = mapDirectionToSwipeDirection(direction);
        const response = await swipeService.createSwipe(user.id, apiDirection);

        if (response.match) {
          Alert.alert(
            "Đã Match! 🎉",
            `Bạn và ${nameToDelete} đã thích nhau.`,
            [{ text: "Được", style: "default" }]
          );
        }
      } catch (error) {
        console.error("Error while swiping:", error);
      }
    } else {
      console.warn("User ID not found for:", nameToDelete);
    }
  };

  const outOfFrame = (name: string) => {
    console.log(name + " đã rời khỏi màn hình!");
    setCharacters((prevChars) => prevChars.filter(character => character.name !== name));
    setHighlightedButton(null);
  };

  const swipe = (dir: Direction) => {
    setSwipeOverlayDirection(dir);
    setTimeout(() => setSwipeOverlayDirection(null), 800);

    if (dir === "up" && !isVip) {
      Alert.alert(
        "Tính năng dành cho VIP",
        "Bạn cần nâng cấp tài khoản VIP để sử dụng tính năng Super Like.",
        [{ text: "Đã hiểu", style: "default" }]
      );
      return;
    }

    const cardsLeft = characters.filter(
      (person) => !alreadyRemoved.includes(person.name)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name;
      const index = characters.findIndex((person) => person.name === toBeRemoved);
      if (index !== -1 && childRefs[index] && childRefs[index].current) {
        alreadyRemoved.push(toBeRemoved);
        (childRefs[index].current as any).swipe(dir);
      }
    }
  };

  const onSwipeWillStart = (dir: Direction) => {
    if (dir === "up" && !isVip) {
      return;
    }
    setHighlightedButton(dir);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Đang tải matches...</Text>
      </SafeAreaView>
    );
  }

  const allSwiped = matchesData && matchesData.length > 0 && matchesData.every(character => alreadyRemoved.includes(character.name));
  if (allSwiped) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Bạn đã quẹt hết tất cả người dùng</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              alreadyRemoved.length = 0;
              refetch();
            }}
          >
            <Text style={styles.refreshButtonText}>Tải lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderOverlayLabel = () => {
    if (!swipeOverlayDirection) return null;

    let label = "";
    let borderColor = "#2ECC71";
    let rotation = "-20deg";
    let labelPosition: any = { top: 100, left: 20 };
    let tintColor = "rgba(46, 204, 113, 0.15)";

    switch (swipeOverlayDirection) {
      case "right":
        label = "LIKE";
        borderColor = "#2ECC71";
        rotation = "-20deg";
        labelPosition = { top: 100, left: 20 };
        tintColor = "rgba(46, 204, 113, 0.15)";
        break;
      case "left":
        label = "NOPE";
        borderColor = "#FF6B6B";
        rotation = "20deg";
        labelPosition = { top: 100, right: 20 };
        tintColor = "rgba(255, 107, 107, 0.15)";
        break;
      case "up":
        label = "SUPER LIKE";
        borderColor = "#3498DB";
        rotation = "0deg";
        labelPosition = { top: 100, alignSelf: "center" };
        tintColor = "rgba(52, 152, 219, 0.15)";
        break;
    }

    return (
      <>
        {/* Tinted overlay */}
        <View style={[styles.overlayTint, { backgroundColor: tintColor }]} />
        {/* Label */}
        <View
          style={[
            styles.overlayLabel,
            labelPosition,
            {
              borderColor,
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <Text style={[styles.overlayText, { color: borderColor }]}>{label}</Text>
        </View>
      </>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {swipeOverlayDirection && (
        renderOverlayLabel()
      )}
      <View style={styles.cardContainer}>
        {characters.map((character, index) => (
          <TinderCard
            ref={childRefs[index] as any}
            key={character.id}
            onSwipe={(dir) => swiped(dir as Direction, character.name)}
            onCardLeftScreen={() => outOfFrame(character.name)}
            onSwipeRequirementFulfilled={(dir) => {
              onSwipeWillStart(dir as Direction);
            }}
            onSwipeRequirementUnfulfilled={() => setHighlightedButton(null)}
          >
            <TinderCardCustom
              character={character}
              overlayDirection={index === characters.length - 1 ? highlightedButton : null}
            />
          </TinderCard>
        ))}
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.dislikeButton,
            highlightedButton === "left" && styles.activeIcon, // Làm nổi bật nếu vuốt sang trái
            highlightedButton === "right" && { opacity: 0 }, // Ẩn khi vuốt sang phải
            highlightedButton === "up" && { opacity: 0 }, // Ẩn khi vuốt lên trên
          ]}
          onPress={() => swipe("left")}
        >
          <Ionicons name="close" size={36} color="white" />
        </TouchableOpacity>
        {
          isVip && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.superLikeButton,
                highlightedButton === "up" && styles.activeIcon, // Làm nổi bật nếu vuốt lên trên
                highlightedButton === "right" && { opacity: 0 }, // Ẩn khi vuốt sang phải
                highlightedButton === "left" && { opacity: 0 }, // Ẩn khi vuốt sang trái
              ]}
              onPress={() => swipe("up")}
            >
              <Ionicons name="star" size={36} color="white" />
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          style={[
            styles.iconButton,
            styles.likeButton,
            highlightedButton === "right" && styles.activeIcon, // Làm nổi bật nếu vuốt sang phải
            highlightedButton === "left" && { opacity: 0 }, // Ẩn khi vuốt sang trái
            highlightedButton === "up" && { opacity: 0 }, // Ẩn khi vuốt lên trên
          ]}
          onPress={() => swipe("right")}
        >
          <Ionicons name="heart" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  // Full screen overlay shown briefly after a swipe
  swipeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 500,
  },
  swipeOverlayText: {
    fontSize: 42,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayLabel: {
    position: "absolute",
    borderWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    zIndex: 210,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
  overlayText: {
    fontSize: 38,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayTint: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    zIndex: 200,
  },
});