import { SafeAreaView, StyleSheet, ActivityIndicator, Alert, Dimensions, StatusBar, Animated } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { TouchableOpacity, Platform } from "react-native";
import TinderCard from "react-tinder-card";
import { TinderCard as TinderCardCustom } from "@/components/features";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetMatches } from "@/hooks/use-get-matches";
import swipeService, { SwipeDirection } from "@/services/swipeService";
import useVipStatus from "@/hooks/useVipStatus";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
  const { data: matchesData, isLoading, error, refetch, isFetching } = useGetMatches();
  const router = useRouter();

  const [characters, setCharacters] = useState<any[]>([]);
  const [highlightedButton, setHighlightedButton] = useState<Direction | null>(null);
  const [swipeOverlayDirection, setSwipeOverlayDirection] = useState<Direction | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  // Animation functions
  const animateButtonPress = (direction: Direction) => {
    // Scale down and back up
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out and in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const swiped = async (direction: Direction, nameToDelete: string) => {
    if (direction === "up" && !isVip) {
      Alert.alert(
        "Tính năng dành cho VIP",
        "Bạn cần nâng cấp tài khoản VIP để sử dụng tính năng Super Like.",
        [{ text: "Đã hiểu", style: "default" }]
      );
      return;
    }

    animateButtonPress(direction);
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
    
    // Add a subtle animation when a card leaves
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const swipe = (dir: Direction) => {
    animateButtonPress(dir);
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
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name; // Find the card object to be removed
      const index = characters.map((person) => person.name).indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      
      // Note: child refs are set in the order of rendering, which is the opposite of the order in the characters array
      // @ts-ignore
      childRefs[index].current.swipe(dir); // Swipe the card!
      
      // Trigger haptic feedback if available
      if (Platform.OS === 'ios') {
        // Use haptic feedback API if available in your setup
      }
    }
  };

  const onSwipeWillStart = (dir: Direction) => {
    if (dir === "up" && !isVip) {
      return;
    }
    setHighlightedButton(dir);
  };

  if (isLoading || isFetching) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#FF416C', '#FF4B2B']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Đang tải matches...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const allSwiped = matchesData && matchesData.length > 0 && matchesData.every(character => alreadyRemoved.includes(character.name));
  if (allSwiped) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#232526', '#414345']}
          style={styles.emptyGradient}
        >
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cards" size={90} color="#FF4B2B" />
            <Text style={styles.emptyTitle}>Hết người dùng!</Text>
            <Text style={styles.emptyText}>Bạn đã quẹt hết tất cả người dùng trong khu vực</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              activeOpacity={0.7}
              onPress={() => {
                alreadyRemoved.length = 0;
                setRefreshing(true);
                refetch().finally(() => setRefreshing(false));
              }}
            >
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.refreshGradient}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.refreshButtonText}>
                    <MaterialIcons name="refresh" size={18} /> Tải lại
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
    let gradientColors = ["#2ECC71", "#2ECC71AA"];

    switch (swipeOverlayDirection) {
      case "right":
        label = "LIKE";
        borderColor = "#2ECC71";
        rotation = "-20deg";
        labelPosition = { top: 100, left: 20 };
        tintColor = "rgba(46, 204, 113, 0.15)";
        gradientColors = ["#2ECC71", "#2ECC71AA"];
        break;
      case "left":
        label = "NOPE";
        borderColor = "#FF6B6B";
        rotation = "20deg";
        labelPosition = { top: 100, right: 20 };
        tintColor = "rgba(255, 107, 107, 0.15)";
        gradientColors = ["#FF6B6B", "#FF6B6BAA"];
        break;
      case "up":
        label = "SUPER LIKE";
        borderColor = "#3498DB";
        rotation = "0deg";
        labelPosition = { top: 100, alignSelf: "center" };
        tintColor = "rgba(52, 152, 219, 0.15)";
        gradientColors = ["#3498DB", "#3498DBAA"];
        break;
    }

    return (
      <>
        {/* Tinted overlay */}
        <LinearGradient 
          colors={[tintColor, "transparent"]}
          style={styles.overlayTint} 
        />
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
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#121212', '#1E1E1E']}
        style={styles.screenGradient}
      > 
        {swipeOverlayDirection && (
          renderOverlayLabel()
        )}
        
        <Animated.View style={[
          styles.cardContainer, 
          {transform: [{scale: scaleAnim}], opacity: fadeAnim}
        ]}>
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
        </Animated.View>
        
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              styles.dislikeButton,
              highlightedButton === "left" && styles.activeIcon,
              highlightedButton === "right" && { opacity: 0 },
              highlightedButton === "up" && { opacity: 0 },
            ]}
            activeOpacity={0.7}
            onPress={() => swipe("left")}
          >
            <LinearGradient
              colors={['#FF4B2B', '#FF416C']}
              style={styles.iconGradient}
            >
              <Ionicons name="close" size={36} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          {isVip && (
            <TouchableOpacity
              style={[
                styles.iconButton,
                styles.superLikeButton,
                highlightedButton === "up" && styles.activeIcon,
                highlightedButton === "right" && { opacity: 0 },
                highlightedButton === "left" && { opacity: 0 },
              ]}
              activeOpacity={0.7}
              onPress={() => swipe("up")}
            >
              <LinearGradient
                colors={['#3498DB', '#2980B9']}
                style={styles.iconGradient}
              >
                <Ionicons name="star" size={36} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.iconButton,
              styles.likeButton,
              highlightedButton === "right" && styles.activeIcon,
              highlightedButton === "left" && { opacity: 0 },
              highlightedButton === "up" && { opacity: 0 },
            ]}
            activeOpacity={0.7}
            onPress={() => swipe("right")}
          >
            <LinearGradient
              colors={['#2ECC71', '#27AE60']}
              style={styles.iconGradient}
            >
              <Ionicons name="heart" size={36} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  // Screen gradient background
  screenGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  // App header styling
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  // Empty state
  emptyGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 12,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
  },
  refreshButton: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF416C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  refreshGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Card container
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
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    color: '#fff',
  },
  // Controls for swiping
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  iconButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dislikeButton: {
    backgroundColor: 'transparent',
  },
  likeButton: {
    backgroundColor: 'transparent',
  },
  superLikeButton: {
    backgroundColor: 'transparent',
  },
  activeIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  // Overlay elements
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  swipeOverlayText: {
    fontSize: 42,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayLabel: {
    position: 'absolute',
    borderWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    zIndex: 210,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  overlayText: {
    fontSize: 38,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlayTint: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 200,
  },
});