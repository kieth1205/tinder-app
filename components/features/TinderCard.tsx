import React, { useState, useEffect } from "react";
import { View } from "../Themed";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from "react-native";
import { IStory, Story } from "./Story";
import { UserSuggestion } from "@/types";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type OverlayDirection = "left" | "right" | "up" | null;

interface TinderCardProps {
  character: UserSuggestion;
  overlayDirection?: OverlayDirection;
  interestId?: string;
}

export const TinderCard = ({ character, overlayDirection, interestId }: TinderCardProps) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  // Animation values for info button only (not the whole card)
  const buttonScaleAnim = useState(new Animated.Value(1))[0];

  const handleInfoPress = () => {
    // Animation when pressing the info button
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    setIsPressed(true);

    // Navigate after a short delay for animation
    setTimeout(() => {
      router.push({
        pathname: "/user-detail/[id]",
        params: { id: character.id, interestId }
      });
    }, 150);
  };

  return (
    // Direct rendering of content - removed the nested container
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

      {/* Gradient for better visual on the button area */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        style={styles.bottomGradient}
      />


      <TouchableOpacity
        style={[
          styles.infoButton,
          isPressed && styles.infoButtonPressed
        ]}
        activeOpacity={0.8}
        onPress={handleInfoPress}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.buttonGradient}
        >
          <Ionicons name="information-circle" size={26} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Like/Nope/Superlike overlay badges */}
      {overlayDirection && (
        <View style={styles.overlayContainer}>
          {overlayDirection === 'right' && (
            <View style={[styles.overlayBadge, styles.likeBadge]}>
              <MaterialCommunityIcons name="heart" size={30} color="white" />
              <View style={styles.overlayTextContainer}>
                <FontAwesome name="check" size={14} color="white" style={styles.overlayIcon} />
                <View style={styles.overlayTextContent}>
                  <Animated.Text style={styles.overlayText}>LIKE</Animated.Text>
                </View>
              </View>
            </View>
          )}

          {overlayDirection === 'left' && (
            <View style={[styles.overlayBadge, styles.nopeBadge]}>
              <MaterialCommunityIcons name="close" size={30} color="white" />
              <View style={styles.overlayTextContainer}>
                <FontAwesome name="times" size={14} color="white" style={styles.overlayIcon} />
                <View style={styles.overlayTextContent}>
                  <Animated.Text style={styles.overlayText}>NOPE</Animated.Text>
                </View>
              </View>
            </View>
          )}

          {overlayDirection === 'up' && (
            <View style={[styles.overlayBadge, styles.superLikeBadge]}>
              <MaterialCommunityIcons name="star" size={30} color="white" />
              <View style={styles.overlayTextContainer}>
                <FontAwesome name="star" size={14} color="white" style={styles.overlayIcon} />
                <View style={styles.overlayTextContent}>
                  <Animated.Text style={styles.overlayText}>SUPER</Animated.Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
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
    overflow: 'hidden',
  },
  // Image styling
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  // Bottom gradient overlay for better button visibility
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  // Info button styling
  infoButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  infoButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
  },
  buttonGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Overlay badges (LIKE/NOPE/SUPERLIKE)
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 150,
  },
  overlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  likeBadge: {
    borderColor: '#2ECC71',
  },
  nopeBadge: {
    borderColor: '#FF6B6B',
  },
  superLikeBadge: {
    borderColor: '#3498DB',
  },
  overlayTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  overlayIcon: {
    marginRight: 5,
  },
  overlayTextContent: {
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // Legacy overlay styles
  overlayLabel: {
    position: 'absolute',
    borderWidth: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    zIndex: 210,
    backgroundColor: 'rgba(0,0,0,0.0)',
  },
  overlayTint: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 200,
  },
});
